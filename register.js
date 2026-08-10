/* IOIS — Production Registration Controller
   Email verification aware, secure storage path, atomic Member ID via RPC.
*/
(() => {
  "use strict";

  const CONFIG = window.IOIS_CONFIG || {};
  const SUPABASE_URL = CONFIG.SUPABASE_URL;
  const SUPABASE_KEY = CONFIG.SUPABASE_PUBLISHABLE_KEY || CONFIG.SUPABASE_ANON_KEY;

  if (!window.supabase || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error("IOIS: Supabase configuration/library missing.");
    return;
  }

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  const PLANS = {
    silver:   { code:"IOIS-SILVER-10",   name:"Tiranga Silver", price:10,  direct:7 },
    gold:     { code:"IOIS-GOLD-49",     name:"Tiranga Gold Pro", price:49, direct:35 },
    platinum: { code:"IOIS-PLATINUM-99", name:"Tiranga Platinum", price:99, direct:70 },
    crystal:  { code:"IOIS-CRYSTAL-199", name:"Tiranga Crystal VIP", price:199, direct:120 },
    student:  { code:"IOIS-STUDENT-299", name:"Govt Exam Pass", price:299, direct:220 },
    diamond:  { code:"IOIS-DIAMOND-499", name:"Tiranga Diamond", price:499, direct:375 },
    vip:      { code:"IOIS-VIP-999", name:"VIP Mastermind Freelancing & AI Pass", price:999, direct:750 }
  };

  let selectedPlan = PLANS.silver;
  const $ = id => document.getElementById(id);

  function msg(text, type="error") {
    const el = $("alert-area");
    if (!el) { alert(text); return; }
    el.className = `mt-4 rounded-xl border p-4 text-sm ${type==="success" ? "border-emerald-400/40 bg-emerald-950/30 text-emerald-200" : "border-red-400/40 bg-red-950/30 text-red-200"}`;
    el.textContent = text;
    el.classList.remove("hidden");
    el.scrollIntoView({behavior:"smooth", block:"center"});
  }
  function clearMsg(){ $("alert-area")?.classList.add("hidden"); }

  function updatePlan() {
    $("selected-plan") && ($("selected-plan").textContent = selectedPlan.name);
    $("selected-price") && ($("selected-price").textContent = `₹${selectedPlan.price}`);
    $("payment-plan-name") && ($("payment-plan-name").textContent = selectedPlan.name);
    $("payment-amount") && ($("payment-amount").textContent = `₹${selectedPlan.price}`);
    $("selected-direct") && ($("selected-direct").textContent = `₹${selectedPlan.direct}`);
  }

  function initPlans() {
    document.querySelectorAll(".plan-box").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".plan-box").forEach(x => x.classList.remove("active"));
        btn.classList.add("active");
        selectedPlan = PLANS[btn.dataset.plan] || {
          code:`IOIS-PLAN-${btn.dataset.price}`, name:btn.dataset.name || "IOIS Plan",
          price:Number(btn.dataset.price), direct:Number(btn.dataset.direct || 0)
        };
        updatePlan();
      });
    });
    const q = new URLSearchParams(location.search).get("plan");
    if (q) {
      const match = [...document.querySelectorAll(".plan-box")].find(x => x.dataset.price === q);
      if (match) match.click();
    }
    updatePlan();
  }

  function getFormData() {
    return {
      fullName: $("full-name").value.trim(),
      email: $("email").value.trim().toLowerCase(),
      phone: $("phone").value.trim(),
      address: $("address").value.trim(),
      withdrawal: $("withdrawal-details").value.trim(),
      sponsorId: $("sponsor-id").value.trim(),
      sponsorName: $("sponsor-name").value.trim(),
      password: $("password").value,
      terms: $("terms").checked,
      screenshot: $("payment-screenshot").files[0] || null,
      proof: $("payment-proof").files[0] || null
    };
  }

  function validate(d) {
    if (d.fullName.split(/\s+/).length < 2) return "कृपया First Name और Surname दोनों दर्ज करें।";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return "कृपया valid Email Address दर्ज करें।";
    if (!/^[6-9]\d{9}$/.test(d.phone)) return "कृपया valid 10-digit mobile number दर्ज करें।";
    if (d.password.length < 8) return "Password कम से कम 8 characters का होना चाहिए।";
    if (!d.address) return "Full Address आवश्यक है।";
    if (!d.withdrawal) return "Withdrawal UPI / Bank Details आवश्यक हैं।";
    if (!d.screenshot) return "Payment Screenshot upload करें।";
    if (!d.proof) return "Payment Address Proof upload करें।";
    if (!d.terms) return "कृपया declaration स्वीकार करें।";
    return null;
  }

  const DB_NAME = "iois-registration-v2", STORE = "pending";
  function openDB() {
    return new Promise((resolve,reject)=>{
      const req = indexedDB.open(DB_NAME,1);
      req.onupgradeneeded=()=>{ if(!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE,{keyPath:"email"}); };
      req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
    });
  }
  async function savePending(d) {
    const db=await openDB();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,"readwrite");
      tx.objectStore(STORE).put({
        email:d.email, fullName:d.fullName, phone:d.phone, address:d.address,
        withdrawal:d.withdrawal, sponsorId:d.sponsorId, sponsorName:d.sponsorName,
        plan:selectedPlan, screenshot:d.screenshot, proof:d.proof,
        savedAt:Date.now()
      });
      tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error);
    });
    db.close();
  }
  async function getPending(email) {
    const db=await openDB();
    const item=await new Promise((resolve,reject)=>{
      const r=db.transaction(STORE,"readonly").objectStore(STORE).get(email);
      r.onsuccess=()=>resolve(r.result); r.onerror=()=>reject(r.error);
    });
    db.close(); return item;
  }
  async function deletePending(email) {
    const db=await openDB();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,"readwrite"); tx.objectStore(STORE).delete(email);
      tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error);
    });
    db.close();
  }

  function storageName(userId, kind, file) {
    const ext=(file.name.split(".").pop()||"bin").toLowerCase().replace(/[^a-z0-9]/g,"");
    return `${userId}/${kind}-${Date.now()}-${crypto.randomUUID()}.${ext}`;
  }
  async function upload(file,userId,kind) {
    const path=storageName(userId,kind,file);
    const {error}=await client.storage.from("member-documents").upload(path,file,{upsert:false,contentType:file.type||undefined});
    if(error) throw error;
    return path;
  }

  async function finalize(pending, user) {
    const btn=$("register-btn"), text=$("register-btn-text"), loader=$("register-loader");
    if(btn) btn.disabled=true;
    if(text) text.textContent="Documents सुरक्षित रूप से upload हो रहे हैं...";
    loader?.classList.remove("hidden");

    try {
      const screenshotPath=await upload(pending.screenshot,user.id,"payment");
      const proofPath=await upload(pending.proof,user.id,"address-proof");

      if(text) text.textContent="Permanent IOIS Member ID बनाया जा रहा है...";
      const siteRoot = new URL(".", location.href).href.replace(/\/$/,"/");
      const {data,error}=await client.rpc("iois_finalize_registration",{
        p_full_name:pending.fullName,
        p_email:pending.email,
        p_phone:pending.phone,
        p_address:pending.address,
        p_plan_amount:Number(pending.plan.price),
        p_plan_code:pending.plan.code,
        p_plan_name:pending.plan.name,
        p_direct_referral_amount:Number(pending.plan.direct||0),
        p_sponsor_id:pending.sponsorId||null,
        p_sponsor_name:pending.sponsorName||null,
        p_withdrawal_details:pending.withdrawal||null,
        p_payment_screenshot_path:screenshotPath,
        p_payment_proof_path:proofPath,
        p_site_url:siteRoot
      });
      if(error) throw error;

      const memberId=data.member_id;
      $("generated-user-id") && ($("generated-user-id").textContent=memberId);
      const modal=$("success-modal"); if(modal) modal.classList.remove("hidden");
      await deletePending(pending.email);
      localStorage.removeItem("iois_pending_registration_email");
      msg(`Registration complete. आपका permanent Member ID है ${memberId}`, "success");
    } catch(e) {
      console.error("IOIS finalize error",e);
      msg(e.message || "Registration complete नहीं हो सकी।", "error");
      // Uploaded files may remain; this is safer than silently deleting user data.
    } finally {
      if(btn) btn.disabled=false;
      if(text) text.innerHTML='<i class="fa-solid fa-user-plus mr-2"></i> CREATE IOIS MEMBER ACCOUNT';
      loader?.classList.add("hidden");
    }
  }

  async function completeIfVerified() {
    const email=localStorage.getItem("iois_pending_registration_email");
    if(!email) return;
    const {data:{session}}=await client.auth.getSession();
    if(!session?.user) return;
    const pending=await getPending(email);
    if(!pending) return;
    $("email") && ($("email").value=pending.email);
    await finalize(pending,session.user);
  }

  async function submit(e) {
    e.preventDefault(); clearMsg();
    const d=getFormData(), error=validate(d);
    if(error){msg(error);return;}

    const btn=$("register-btn"), text=$("register-btn-text"), loader=$("register-loader");
    btn.disabled=true; loader?.classList.remove("hidden"); if(text) text.textContent="Secure account बनाया जा रहा है...";

    try {
      await savePending(d);
      localStorage.setItem("iois_pending_registration_email",d.email);

      const redirect = new URL("register.html",location.href).href + "?complete=1";
      const {data,error}=await client.auth.signUp({
        email:d.email,password:d.password,
        options:{emailRedirectTo:redirect,data:{full_name:d.fullName,phone:d.phone,plan_amount:selectedPlan.price}}
      });
      if(error) throw error;

      if(data.session) {
        const pending=await getPending(d.email);
        await finalize(pending,data.user);
      } else {
        msg("Account बन गया है। कृपया अपने email inbox में verification link खोलें। Verification के बाद इसी device पर registration automatically complete होगा।", "success");
        if(text) text.textContent="VERIFICATION EMAIL SENT";
      }
    } catch(e) {
      console.error("IOIS registration error",e);
      let m=e.message||"Registration failed.";
      if(/rate limit|rate_limit|too many|email.*limit/i.test(m))
        m="Email verification भेजने की Supabase limit पूरी हो गई है। बार-बार Register न दबाएँ। Custom SMTP लगने के बाद production में यह समस्या कम होगी।";
      if(/already registered|already exists/i.test(m))
        m="यह email पहले से registered है। पहले email verify करके Login करें।";
      msg(m,"error");
    } finally {
      if(!/VERIFICATION EMAIL SENT/.test(text?.textContent||"")) {
        btn.disabled=false; loader?.classList.add("hidden");
      }
    }
  }


  window.togglePassword = () => {
    const input=$("password"), icon=$("password-eye");
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
    if (icon) icon.className = input.type === "password" ? "fa-solid fa-eye" : "fa-solid fa-eye-slash";
  };
  window.copyUPI = async () => {
    const v=CONFIG.paymentUPI || "8877490845@spicepay";
    try { await navigator.clipboard.writeText(v); alert("UPI ID copied: "+v); }
    catch { alert(v); }
  };

  window.copyGeneratedUserID = async () => {
    const v=$("generated-user-id")?.textContent||"";
    try { await navigator.clipboard.writeText(v); alert("IOIS Member ID copied: "+v); }
    catch { alert("आपका IOIS Member ID: "+v); }
  };

  document.addEventListener("DOMContentLoaded",()=>{
    initPlans();
    $("registration-form")?.addEventListener("submit",submit);
    $("copy-upi-btn")?.addEventListener("click",async()=>{
      const v=CONFIG.paymentUPI||"";
      try{await navigator.clipboard.writeText(v);alert("UPI ID copied");}catch{alert(v);}
    });
    completeIfVerified().catch(e=>console.error(e));
  });
})();
