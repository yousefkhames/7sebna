(function () {
  'use strict';
  var C = window.Core, KEY = '7sebna.v1';
  var COLORS = ['#0e8a82', '#e4572e', '#c9962c', '#5b6bd6', '#b04a8a', '#3f8f4f', '#d0703a', '#2d7bb5'];
  var CATS = { food: '🍽️', home: '🏠', transport: '🚕', fun: '🎉', shop: '🛍️', bills: '💡', trip: '✈️', other: '🧾' };
  var EMOJIS = ['🏠', '✈️', '🍕', '🎉', '🏖️', '🚗', '⚽', '☕'];
  var CURS = ['EGP', 'SAR', 'AED', 'KWD', 'USD', 'EUR', 'GBP', 'JOD', 'QAR'];
  var I18N = {
    ar: { app: 'حسبنا', tag: 'قسّم المصاريف وصفّي الحساب بأقل عدد تحويلات', groups: 'مجموعاتي', newGroup: 'مجموعة جديدة', sample: 'جرّب بيانات تجريبية',
      emptyTitle: 'لسه مفيش مجموعات', emptySub: 'اعمل مجموعة للشقة أو الرحلة أو الطلعة، وضيف الأصحاب.', members: 'أعضاء', expenses: 'مصروف', name: 'الاسم', groupName: 'اسم المجموعة', icon: 'الأيقونة', currency: 'العملة',
      addMember: 'إضافة عضو', memberName: 'اسم العضو', add: 'إضافة', save: 'حفظ', cancel: 'إلغاء', del: 'حذف', edit: 'تعديل', back: 'رجوع', create: 'إنشاء',
      tExp: 'المصاريف', tBal: 'الأرصدة', tSet: 'التسوية', addExpense: 'مصروف جديد', editExpense: 'تعديل المصروف', desc: 'الوصف', amount: 'المبلغ', paidBy: 'اللي دفع', date: 'التاريخ', category: 'النوع',
      splitEq: 'بالتساوي', splitShares: 'حصص', splitPct: 'نسبة %', splitExact: 'مبالغ', splitWho: 'اتقسم على', total: 'إجمالي المصاريف', paid: 'دفع', owes: 'عليه', owed: 'ليه', settled: 'متصفّي',
      owesYou: 'له', youOwe: 'عليه', perShare: 'نصيبه', plan: 'خطة التسوية', planHint: 'أقل عدد تحويلات لتصفية الكل.', markPaid: 'تم الدفع', allSettled: 'الكل متصفّي! مفيش حد عليه حاجة.',
      copySummary: 'انسخ الملخص', copied: 'تم النسخ', history: 'التحويلات المسجّلة', undo: 'تراجع', noExpenses: 'مفيش مصاريف لسه', noExpensesSub: 'اضغط «مصروف جديد» وابدأ.', byCat: 'حسب النوع',
      settings: 'الإعدادات', language: 'اللغة', theme: 'المظهر', light: 'فاتح', dark: 'داكن', exportJson: 'تصدير كل البيانات (JSON)', importJson: 'استيراد بيانات', exportCsv: 'تصدير المجموعة (CSV)', reset: 'مسح كل البيانات',
      resetConfirm: 'هتتمسح كل المجموعات من المتصفح ده. متأكد؟', delGroupConfirm: 'حذف المجموعة وكل مصاريفها؟', delExpConfirm: 'حذف المصروف ده؟', imported: 'تم الاستيراد', importBad: 'الملف مش صالح',
      saved: 'تم الحفظ', e_desc: 'اكتب وصف للمصروف', e_amount: 'اكتب مبلغ صحيح أكبر من صفر', e_payer: 'اختار مين دفع', e_who: 'اختار على مين هيتقسم', e_exactSum: 'مجموع المبالغ لازم يساوي المبلغ الكلي', e_percentSum: 'مجموع النسب لازم يساوي 100',
      remaining: 'المتبقي', sumNow: 'المجموع الحالي', inUse: 'العضو ده عليه مصاريف أو تحويلات، مينفعش يتحذف', needMembers: 'ضيف عضوين على الأقل الأول', dataLocal: 'بياناتك محفوظة على جهازك فقط. اعمل تصدير للنسخ الاحتياطي.',
      shareHdr: 'تسوية', pays: 'يدفع لـ', cat_food: 'أكل', cat_home: 'البيت', cat_transport: 'مواصلات', cat_fun: 'خروجة', cat_shop: 'مشتريات', cat_bills: 'فواتير', cat_trip: 'سفر', cat_other: 'أخرى', members2: 'الأعضاء', each: 'لكل واحد', shareN: 'سهم', manage: 'إدارة المجموعة', rename: 'اسم المجموعة', cantRemove: 'مينفعش', paidTo: 'سدّد لـ', dupName: 'الاسم موجود بالفعل' },
    en: { app: '7sebna', tag: 'Split expenses and settle up with the fewest payments', groups: 'My groups', newGroup: 'New group', sample: 'Try sample data',
      emptyTitle: 'No groups yet', emptySub: 'Make a group for your flat, a trip or a night out, then add your friends.', members: 'members', expenses: 'expenses', name: 'Name', groupName: 'Group name', icon: 'Icon', currency: 'Currency',
      addMember: 'Add member', memberName: 'Member name', add: 'Add', save: 'Save', cancel: 'Cancel', del: 'Delete', edit: 'Edit', back: 'Back', create: 'Create',
      tExp: 'Expenses', tBal: 'Balances', tSet: 'Settle up', addExpense: 'Add expense', editExpense: 'Edit expense', desc: 'Description', amount: 'Amount', paidBy: 'Paid by', date: 'Date', category: 'Category',
      splitEq: 'Equally', splitShares: 'Shares', splitPct: 'Percent', splitExact: 'Amounts', splitWho: 'Split between', total: 'Total spent', paid: 'Paid', owes: 'Owes', owed: 'Is owed', settled: 'Settled',
      owesYou: 'is owed', youOwe: 'owes', perShare: 'Share', plan: 'Settlement plan', planHint: 'Fewest payments that clear everyone.', markPaid: 'Mark paid', allSettled: 'All settled! Nobody owes anything.',
      copySummary: 'Copy summary', copied: 'Copied', history: 'Recorded payments', undo: 'Undo', noExpenses: 'No expenses yet', noExpensesSub: 'Tap "Add expense" to start.', byCat: 'By category',
      settings: 'Settings', language: 'Language', theme: 'Theme', light: 'Light', dark: 'Dark', exportJson: 'Export all data (JSON)', importJson: 'Import data', exportCsv: 'Export group (CSV)', reset: 'Erase all data',
      resetConfirm: 'This erases every group in this browser. Sure?', delGroupConfirm: 'Delete this group and all its expenses?', delExpConfirm: 'Delete this expense?', imported: 'Imported', importBad: 'Not a valid file',
      saved: 'Saved', e_desc: 'Enter a description', e_amount: 'Enter a valid amount above zero', e_payer: 'Choose who paid', e_who: 'Choose who shares it', e_exactSum: 'Amounts must add up to the total', e_percentSum: 'Percentages must add up to 100',
      remaining: 'Left', sumNow: 'Sum now', inUse: 'This member has expenses or payments and cannot be removed', needMembers: 'Add at least two members first', dataLocal: 'Your data lives only on this device. Export for a backup.',
      shareHdr: 'Settle up', pays: 'pays', cat_food: 'Food', cat_home: 'Home', cat_transport: 'Transport', cat_fun: 'Fun', cat_shop: 'Shopping', cat_bills: 'Bills', cat_trip: 'Travel', cat_other: 'Other', members2: 'Members', each: 'Each', shareN: 'share', manage: 'Manage group', rename: 'Group name', cantRemove: 'Cannot', paidTo: 'paid', dupName: 'That name already exists' }
  };

  var S = load();
  var ui = { modal: null, form: null };

  function load() {
    var d; try { d = JSON.parse(localStorage.getItem(KEY)); } catch (e) { d = null; }
    var cl = C.sanitizeImport(d && Array.isArray(d.groups) ? d : { groups: [] });
    return { lang: d && d.lang === 'en' ? 'en' : (d && d.lang === 'ar' ? 'ar' : 'ar'),
      theme: d && d.theme === 'dark' ? 'dark' : 'light', groups: cl.groups };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('⚠️ storage'); } }
  function t(k) { return (I18N[S.lang] && I18N[S.lang][k]) || I18N.en[k] || k; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-3); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function money(m, cur) {
    var v = m / 100, loc = S.lang === 'ar' ? 'ar-EG' : 'en-US';
    try { return '<span class="num">' + esc(new Intl.NumberFormat(loc, { style: 'currency', currency: cur, minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(v)) + '</span>'; }
    catch (e) { return '<span class="num">' + v.toFixed(2) + ' ' + esc(cur) + '</span>'; }
  }
  function moneyText(m, cur) { return (m / 100).toFixed(2).replace(/\.00$/, '') + ' ' + cur; }
  function nf(n) { return new Intl.NumberFormat(S.lang === 'ar' ? 'ar-EG' : 'en-US').format(n); }
  function fdate(s) { try { return new Date(s + 'T12:00:00').toLocaleDateString(S.lang === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short' }); } catch (e) { return s; } }
  function color(g, id) { var i = g.members.findIndex(function (m) { return m.id === id; }); return COLORS[(i < 0 ? 0 : i) % COLORS.length]; }
  function mem(g, id) { return g.members.find(function (m) { return m.id === id; }) || { id: id, name: '?' }; }
  function av(g, id) { var n = mem(g, id).name; return '<span class="av" style="--c:' + color(g, id) + '">' + esc(Array.from(n)[0] || '?') + '</span>'; }
  var IC = { exp: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>', bal: '<path d="M12 4v16M5 20h14M6 7h12"/><path d="M6 7l-3 7a3 3 0 006 0zM18 7l-3 7a3 3 0 006 0z"/>', set: '<path d="M3 12l5-5 4 3 4-3 5 5-9 8z"/><path d="M8 12l3 3"/>', users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><path d="M16 5.5a3 3 0 010 5.5M18 14.5c2 .7 3 2.7 3 5.5"/>', gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>', plus: '<path d="M12 5v14M5 12h14"/>' };
  function ic(n) { return '<svg class="ico" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[n] + '</svg>'; }
  function signed(v, cur) { var x = v / 100; try { return '<span class="num">' + new Intl.NumberFormat(S.lang === 'ar' ? 'ar-EG' : 'en-US', { style: 'currency', currency: cur, signDisplay: 'always', minimumFractionDigits: Math.abs(x) % 1 ? 2 : 0 }).format(x) + '</span>'; } catch (e) { return '<span class="num">' + x.toFixed(2) + ' ' + esc(cur) + '</span>'; } }
  function toast(msg) { var el = document.getElementById('toast'); el.innerHTML = '<span>' + esc(msg) + '</span>'; clearTimeout(toast.t); toast.t = setTimeout(function () { el.innerHTML = ''; }, 2200); }
  function route() { var h = location.hash.replace(/^#\/?/, '').split('/'); return h[0] === 'g' && h[1] ? { id: h[1], tab: h[2] || 'exp' } : { id: null }; }
  function curGroup() { var r = route(); return r.id ? S.groups.find(function (g) { return g.id === r.id; }) : null; }

  function applyLang() {
    document.documentElement.lang = S.lang; document.documentElement.dir = S.lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('data-theme', S.theme);
    document.title = S.lang === 'ar' ? 'حسبنا · 7sebna' : '7sebna · حسبنا';
  }

  // ---------- views ----------
  function render() {
    applyLang();
    var g = curGroup(), r = route(), html;
    if (r.id && !g) { location.hash = '#/'; return; }
    html = g ? groupView(g, r.tab) : homeView();
    document.getElementById('app').innerHTML = html + (ui.modal ? modalView() : '');
    if (ui.modal && ui.modal.focus) { var f = document.getElementById(ui.modal.focus); if (f) f.focus(); ui.modal.focus = null; }
  }

  function homeView() {
    var h = '<div class="wrap"><header class="top"><div class="brand"><img src="logo.svg" alt=""><div><b>' + t('app') + '</b></div></div>' +
      '<button class="iconbtn" data-a="settings" aria-label="' + t('settings') + '">' + ic('gear') + '</button></header>';
    h += '<div class="hero"><small>' + t('tag') + '</small><div class="big">' + t('groups') + ' · <span class="num">' + nf(S.groups.length) + '</span></div><small>' + t('dataLocal') + '</small></div>';
    if (!S.groups.length) {
      h += '<div class="empty"><div class="big">🧾</div><h2>' + t('emptyTitle') + '</h2><p>' + t('emptySub') + '</p><p><button class="btn" data-a="newGroup">+ ' + t('newGroup') + '</button></p><p><button class="btn ghost sm" data-a="sample">' + t('sample') + '</button></p></div>';
    } else {
      h += '<div class="glist">';
      S.groups.forEach(function (g, i) {
        var b = C.balances(g), tot = C.totals(g);
        h += '<button class="gcard" data-a="open" data-id="' + g.id + '" style="--c:' + COLORS[i % COLORS.length] + '"><span class="emo">' + esc(g.emoji || '🧾') + '</span><span class="info"><b>' + esc(g.name) + '</b><span><span class="num">' + nf(g.members.length) + '</span> ' + t('members') + ' · <span class="num">' + nf(g.expenses.length) + '</span> ' + t('expenses') + '</span></span><span class="pill">' + money(tot.spent, g.currency) + '</span></button>';
      });
      h += '</div><div class="acts"><button class="btn" data-a="newGroup">+ ' + t('newGroup') + '</button></div>';
    }
    return h + '</div>';
  }

  function groupView(g, tab) {
    var h = '<div class="wrap"><header class="top"><button class="iconbtn" data-a="home" aria-label="' + t('back') + '">' + (S.lang === 'ar' ? '→' : '←') + '</button><h1>' + esc(g.emoji || '') + ' ' + esc(g.name) + '</h1>' +
      '<button class="iconbtn" data-a="manage" aria-label="' + t('manage') + '">' + ic('users') + '</button><button class="iconbtn" data-a="settings" aria-label="' + t('settings') + '">' + ic('gear') + '</button></header>';
    var tot = C.totals(g);
    h += '<div class="hero"><small>' + t('total') + '</small><div class="big">' + money(tot.spent, g.currency) + '</div><div class="row"><span><span class="num">' + nf(g.members.length) + '</span> ' + t('members') + '</span><span><span class="num">' + nf(g.expenses.length) + '</span> ' + t('expenses') + '</span></div></div>';
    h += tab === 'bal' ? balView(g, tot) : tab === 'set' ? setView(g) : expView(g);
    if (tab === 'exp') h += '<button class="fab" data-a="addExp">' + ic('plus') + ' ' + t('addExpense') + '</button>';
    h += '<nav class="tabs" role="tablist">' + [['exp', 'exp', 'tExp'], ['bal', 'bal', 'tBal'], ['set', 'set', 'tSet']].map(function (x) {
      return '<button role="tab" aria-selected="' + (tab === x[0]) + '" data-a="tab" data-tab="' + x[0] + '"><span class="ti">' + ic(x[1]) + '</span>' + t(x[2]) + '</button>';
    }).join('') + '</nav></div>';
    return h;
  }

  function expView(g) {
    if (!g.expenses.length) return '<div class="empty"><div class="big">🧾</div><h2>' + t('noExpenses') + '</h2><p>' + t('noExpensesSub') + '</p></div>';
    var list = g.expenses.slice().sort(function (a, b) { return (b.date || '').localeCompare(a.date || '') || 0; });
    var h = '<div class="receipt zig">';
    list.forEach(function (e) {
      var n = Object.keys(C.computeShares(e)).length;
      h += '<button class="exp" data-a="editExp" data-id="' + e.id + '"><span class="cat">' + (CATS[e.cat] || CATS.other) + '</span><span class="m"><b>' + esc(e.desc) + '</b><span>' + esc(mem(g, e.payer).name) + ' · ' + fdate(e.date) + '</span></span><span class="a">' + money(e.amount, g.currency) + '<small>' + nf(n) + ' ✕</small></span></button>';
    });
    return h + '</div><p class="lead">' + t('dataLocal') + '</p>';
  }

  function balView(g, tot) {
    var b = C.balances(g), max = 1;
    Object.keys(b).forEach(function (i) { max = Math.max(max, Math.abs(b[i])); });
    var h = '<div class="receipt"><h2>' + t('tBal') + '</h2>';
    g.members.forEach(function (m) {
      var v = b[m.id] || 0, w = Math.round(Math.abs(v) / max * 50);
      var label = v > 0 ? '<span class="pos">' + signed(v, g.currency) + '</span>' : v < 0 ? '<span class="neg">' + signed(v, g.currency) + '</span>' : '<span class="zero">' + t('settled') + '</span>';
      h += '<div class="brow">' + av(g, m.id) + '<div class="nm"><b>' + esc(m.name) + '</b><small class="zero">' + t('paid') + ' ' + money(tot.paid[m.id] || 0, g.currency) + ' · ' + t('perShare') + ' ' + money(tot.share[m.id] || 0, g.currency) + '</small>' +
        '<div class="bar"><i style="' + (v >= 0 ? 'inset-inline-start:50%' : 'inset-inline-end:50%') + ';width:' + w + '%;background:' + (v >= 0 ? 'var(--ok)' : 'var(--coral)') + '"></i></div></div><b>' + label + '</b></div>';
    });
    h += '</div>';
    var cats = Object.keys(tot.byCat).sort(function (a, c) { return tot.byCat[c] - tot.byCat[a]; });
    if (cats.length) {
      h += '<div class="receipt"><h2>' + t('byCat') + '</h2><div class="cbar">' + cats.map(function (c, i) { return '<i style="width:' + (tot.byCat[c] / tot.spent * 100) + '%;background:' + COLORS[i % COLORS.length] + '"></i>'; }).join('') + '</div><div class="legend">' +
        cats.map(function (c, i) { return '<span><span class="dot" style="--c:' + COLORS[i % COLORS.length] + '"></span>' + (CATS[c] || '🧾') + ' ' + t('cat_' + (CATS[c] ? c : 'other')) + ' · ' + money(tot.byCat[c], g.currency) + '</span>'; }).join('') + '</div></div>';
    }
    return h;
  }

  function setView(g) {
    var plan = C.settle(C.balances(g)), h = '<div class="receipt"><h2>' + t('plan') + '</h2><p class="lead">' + t('planHint') + '</p>';
    if (!plan.length) h += '<div class="allok"><div class="big">🎉</div>' + t('allSettled') + '</div>';
    plan.forEach(function (p, i) {
      h += '<div class="tx"><div class="who">' + av(g, p.from) + '<b>' + esc(mem(g, p.from).name) + '</b><span class="arrow">→</span>' + av(g, p.to) + '<b>' + esc(mem(g, p.to).name) + '</b></div><span class="amt">' + money(p.amount, g.currency) + '</span><button class="btn sm" data-a="pay" data-i="' + i + '">✓ ' + t('markPaid') + '</button></div>';
    });
    h += '</div>';
    if (plan.length) h += '<div class="acts"><button class="btn ghost" data-a="copy">📋 ' + t('copySummary') + '</button></div>';
    if (g.payments.length) {
      h += '<div class="receipt"><h2>' + t('history') + '</h2>';
      g.payments.slice().reverse().forEach(function (p) {
        h += '<div class="tx"><div class="who">' + av(g, p.from) + '<b>' + esc(mem(g, p.from).name) + '</b><span class="arrow">→</span>' + av(g, p.to) + '<b>' + esc(mem(g, p.to).name) + '</b></div><span class="amt">' + money(p.amount, g.currency) + '</span><button class="btn ghost sm" data-a="undoPay" data-id="' + p.id + '">' + t('undo') + '</button></div>';
      });
      h += '</div>';
    }
    return h;
  }

  // ---------- modals ----------
  function modalView() {
    var m = ui.modal, body = '';
    if (m.type === 'group') body = groupForm();
    else if (m.type === 'manage') body = manageForm();
    else if (m.type === 'expense') body = expenseForm();
    else if (m.type === 'settings') body = settingsForm();
    return '<div class="overlay" data-a="closeBg"><div class="sheet" role="dialog" aria-modal="true">' + body + '</div></div>';
  }
  function groupForm() {
    var f = ui.form;
    return '<h2>' + t('newGroup') + '</h2><label class="f">' + t('groupName') + '<input id="gname" maxlength="60" value="' + esc(f.name) + '"></label>' +
      '<label class="f">' + t('icon') + '</label><div class="emojis">' + EMOJIS.map(function (e) { return '<button type="button" data-a="gemoji" data-e="' + e + '" aria-pressed="' + (f.emoji === e) + '">' + e + '</button>'; }).join('') + '</div>' +
      '<label class="f">' + t('currency') + '<select id="gcur">' + CURS.map(function (c) { return '<option' + (f.currency === c ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select></label>' +
      '<label class="f">' + t('members2') + '</label><div class="chips">' + f.members.map(function (n, i) { return '<span class="chip"><button data-a="gdelm" data-i="' + i + '" aria-label="' + t('del') + '">×</button>' + esc(n) + '</span>'; }).join('') + '</div>' +
      '<div class="srow"><input type="text" id="gmem" maxlength="40" placeholder="' + t('memberName') + '" style="flex:1;width:auto"><button class="btn sm" data-a="gaddm">' + t('add') + '</button></div>' +
      (f.err ? '<div class="note err">' + esc(f.err) + '</div>' : '') +
      '<div class="acts"><button class="btn" data-a="gsave">' + t('create') + '</button><button class="btn ghost" data-a="close">' + t('cancel') + '</button></div>';
  }
  function manageForm() {
    var g = curGroup(), f = ui.form;
    return '<h2>' + t('manage') + '</h2><label class="f">' + t('rename') + '<input id="mname" maxlength="60" value="' + esc(g.name) + '"></label>' +
      '<label class="f">' + t('members2') + '</label><div class="chips">' + g.members.map(function (m) { return '<span class="chip"><button data-a="mdel" data-id="' + m.id + '" aria-label="' + t('del') + '">×</button>' + esc(m.name) + '</span>'; }).join('') + '</div>' +
      '<div class="srow"><input type="text" id="mnew" maxlength="40" placeholder="' + t('memberName') + '" style="flex:1;width:auto"><button class="btn sm" data-a="madd">' + t('add') + '</button></div>' +
      (f && f.err ? '<div class="note err">' + esc(f.err) + '</div>' : '') +
      '<div class="acts"><button class="btn" data-a="msave">' + t('save') + '</button><button class="btn ghost" data-a="close">' + t('cancel') + '</button><button class="btn ghost" data-a="csv">' + t('exportCsv') + '</button><button class="btn danger" data-a="delGroup">' + t('del') + '</button></div>';
  }
  function expenseForm() {
    var g = curGroup(), f = ui.form, sp = f.split;
    var h = '<h2>' + (f.id ? t('editExpense') : t('addExpense')) + '</h2>' +
      '<label class="f">' + t('desc') + '<input id="fdesc" maxlength="100" value="' + esc(f.desc) + '"></label>' +
      '<label class="f">' + t('amount') + ' (' + esc(g.currency) + ')<input id="famt" inputmode="decimal" autocomplete="off" value="' + esc(f.amount) + '"></label>' +
      '<label class="f">' + t('paidBy') + '<select id="fpay">' + g.members.map(function (m) { return '<option value="' + m.id + '"' + (f.payer === m.id ? ' selected' : '') + '>' + esc(m.name) + '</option>'; }).join('') + '</select></label>' +
      '<label class="f">' + t('date') + '<input id="fdate" type="date" value="' + esc(f.date) + '"></label>' +
      '<label class="f">' + t('category') + '<select id="fcat">' + Object.keys(CATS).map(function (c) { return '<option value="' + c + '"' + (f.cat === c ? ' selected' : '') + '>' + CATS[c] + ' ' + t('cat_' + c) + '</option>'; }).join('') + '</select></label>' +
      '<label class="f">' + t('splitWho') + '</label><div class="seg">' + [['equal', 'splitEq'], ['shares', 'splitShares'], ['percent', 'splitPct'], ['exact', 'splitExact']].map(function (x) { return '<button type="button" data-a="stype" data-v="' + x[0] + '" aria-pressed="' + (sp.type === x[0]) + '">' + t(x[1]) + '</button>'; }).join('') + '</div><div id="splits">' + splitRows(g, f) + '</div>' +
      '<div id="ferr">' + (f.err ? '<div class="note err">' + esc(f.err) + '</div>' : '') + '</div>' +
      '<div class="acts"><button class="btn" data-a="esave">' + t('save') + '</button><button class="btn ghost" data-a="close">' + t('cancel') + '</button>' + (f.id ? '<button class="btn danger" data-a="edel">' + t('del') + '</button>' : '') + '</div>';
    return h;
  }
  function splitRows(g, f) {
    var sp = f.split, h = '';
    g.members.forEach(function (m) {
      var id = m.id, ctl;
      if (sp.type === 'equal') ctl = '<input type="checkbox" data-s="' + id + '"' + (sp.who[id] ? ' checked' : '') + ' aria-label="' + esc(m.name) + '">';
      else ctl = '<input type="text" inputmode="decimal" data-s="' + id + '" value="' + esc(sp.vals[id] || '') + '" placeholder="0">';
      h += '<div class="srow"><span class="av" style="--c:' + color(g, id) + ';width:30px;height:30px;font-size:.8rem">' + esc(Array.from(m.name)[0] || '?') + '</span><span class="nm">' + esc(m.name) + '</span>' + ctl + '</div>';
    });
    return h + '<div class="note" id="snote">' + splitNote(g, f) + '</div>';
  }
  function readSplitVals() { return ui.form.split.vals; }
  function splitNote(g, f) {
    var sp = f.split, amt = C.toMinor(f.amount); if (isNaN(amt)) amt = 0;
    if (sp.type === 'equal') { var n = Object.keys(sp.who).filter(function (k) { return sp.who[k]; }).length; return n && amt ? t('each') + ': ' + money(Math.floor(amt / n), g.currency) : '&nbsp;'; }
    if (sp.type === 'shares') { var q = 0; Object.keys(sp.vals).forEach(function (k) { var v = parseFloat(sp.vals[k]); if (v > 0) q += v; }); return t('sumNow') + ': <span class="num">' + q + '</span> ' + t('shareN'); }
    if (sp.type === 'percent') { var p = 0; Object.keys(sp.vals).forEach(function (k) { var v = parseFloat(sp.vals[k]); if (v > 0) p += v; }); return t('sumNow') + ': <span class="num">' + (Math.round(p * 100) / 100) + '%</span> · ' + t('remaining') + ': <span class="num">' + (Math.round((100 - p) * 100) / 100) + '%</span>'; }
    var s = 0; Object.keys(sp.vals).forEach(function (k) { var v = C.toMinor(sp.vals[k]); if (v > 0) s += v; });
    return t('sumNow') + ': ' + money(s, g.currency) + ' · ' + t('remaining') + ': ' + money(amt - s, g.currency).replace(/−/, '-');
  }
  function settingsForm() {
    return '<h2>' + t('settings') + '</h2><label class="f">' + t('language') + '</label><div class="seg"><button data-a="lang" data-v="ar" aria-pressed="' + (S.lang === 'ar') + '">العربية</button><button data-a="lang" data-v="en" aria-pressed="' + (S.lang === 'en') + '">English</button></div>' +
      '<label class="f">' + t('theme') + '</label><div class="seg"><button data-a="theme" data-v="light" aria-pressed="' + (S.theme === 'light') + '">☀️ ' + t('light') + '</button><button data-a="theme" data-v="dark" aria-pressed="' + (S.theme === 'dark') + '">🌙 ' + t('dark') + '</button></div>' +
      '<div class="acts"><button class="btn ghost" data-a="exportAll">⬇ ' + t('exportJson') + '</button><button class="btn ghost" data-a="importAll">⬆ ' + t('importJson') + '</button><button class="btn danger" data-a="resetAll">' + t('reset') + '</button></div>' +
      '<input type="file" id="ifile" accept="application/json,.json" hidden><p class="lead" style="margin-top:14px">' + t('dataLocal') + '</p><div class="acts"><button class="btn" data-a="close">OK</button></div>';
  }

  // ---------- actions ----------
  function newExpenseForm(g, e) {
    if (e) {
      var s = e.split, sp = { type: s.type, who: {}, vals: {} };
      if (s.type === 'equal') (s.who || []).forEach(function (i) { sp.who[i] = true; });
      else if (s.type === 'exact') Object.keys(s.amounts || {}).forEach(function (i) { sp.vals[i] = (s.amounts[i] / 100).toString(); });
      else if (s.type === 'percent') Object.keys(s.pct || {}).forEach(function (i) { sp.vals[i] = String(s.pct[i]); });
      else Object.keys(s.shares || {}).forEach(function (i) { sp.vals[i] = String(s.shares[i]); });
      if (s.type !== 'equal') g.members.forEach(function (m) { sp.who[m.id] = true; });
      return { id: e.id, desc: e.desc, amount: (e.amount / 100).toString(), payer: e.payer, date: e.date, cat: e.cat, split: sp, err: '' };
    }
    var who = {}; g.members.forEach(function (m) { who[m.id] = true; });
    return { id: null, desc: '', amount: '', payer: g.members[0].id, date: today(), cat: 'food', split: { type: 'equal', who: who, vals: {} }, err: '' };
  }
  function syncFormFields() {
    var f = ui.form; if (!f) return;
    var q = function (id) { return document.getElementById(id); };
    if (ui.modal.type === 'expense') { f.desc = q('fdesc').value; f.amount = q('famt').value; f.payer = q('fpay').value; f.date = q('fdate').value; f.cat = q('fcat').value; }
    if (ui.modal.type === 'group') { f.name = q('gname').value; f.currency = q('gcur').value; }
  }
  function buildExpense(g, f) {
    var amount = C.toMinor(f.amount), sp = f.split, split;
    if (isNaN(amount)) amount = 0;
    if (sp.type === 'equal') split = { type: 'equal', who: g.members.filter(function (m) { return sp.who[m.id]; }).map(function (m) { return m.id; }) };
    else if (sp.type === 'exact') { split = { type: 'exact', amounts: {} }; Object.keys(sp.vals).forEach(function (i) { var v = C.toMinor(sp.vals[i]); if (v > 0) split.amounts[i] = v; }); }
    else { var key = sp.type === 'percent' ? 'pct' : 'shares'; split = { type: sp.type }; split[key] = {}; Object.keys(sp.vals).forEach(function (i) { var v = parseFloat(String(sp.vals[i]).replace(',', '.')); if (v > 0) split[key][i] = v; }); }
    return { id: f.id || uid(), desc: f.desc.trim(), amount: amount, payer: f.payer, date: f.date || today(), cat: f.cat, split: split };
  }
  function summary(g) {
    var plan = C.settle(C.balances(g)), lines = [(g.emoji || '') + ' ' + g.name + ' · ' + t('shareHdr')];
    plan.forEach(function (p) { lines.push('• ' + mem(g, p.from).name + ' ' + t('pays') + ' ' + mem(g, p.to).name + ': ' + moneyText(p.amount, g.currency)); });
    lines.push(t('total') + ': ' + moneyText(C.totals(g).spent, g.currency)); lines.push('— 7sebna / حسبنا');
    return lines.join('\n');
  }
  function download(name, text, type) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type })); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function addMemberTo(list, name) { name = name.trim(); if (!name) return false; if (list.some(function (n) { return (n.name || n).toLowerCase() === name.toLowerCase(); })) return 'dup'; return name; }
  function sample() {
    var ids = ['a', 'b', 'c', 'd'].map(function (x) { return 's' + x; }), names = S.lang === 'ar' ? ['أحمد', 'منى', 'يوسف', 'سارة'] : ['Ahmed', 'Mona', 'Yousef', 'Sara'];
    var all = ids.slice();
    S.groups.unshift({ id: uid(), name: S.lang === 'ar' ? 'رحلة دهب' : 'Dahab trip', emoji: '🏖️', currency: 'EGP', members: ids.map(function (id, i) { return { id: id, name: names[i] }; }),
      expenses: [
        { id: uid(), desc: S.lang === 'ar' ? 'بنزين' : 'Fuel', amount: 120000, payer: ids[0], date: today(), cat: 'transport', split: { type: 'equal', who: all } },
        { id: uid(), desc: S.lang === 'ar' ? 'كامب وأكل' : 'Camp and dinner', amount: 245050, payer: ids[1], date: today(), cat: 'food', split: { type: 'equal', who: all } },
        { id: uid(), desc: S.lang === 'ar' ? 'غطس' : 'Snorkelling', amount: 60000, payer: ids[2], date: today(), cat: 'fun', split: { type: 'equal', who: [ids[1], ids[2], ids[3]] } }],
      payments: [] });
  }

  document.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-a]'); if (!el) return;
    var a = el.dataset.a, g = curGroup(), r = route();
    if (a === 'closeBg') { if (ev.target !== el) return; ui.modal = null; return render(); }
    if (ui.modal) syncFormFields();
    switch (a) {
      case 'settings': ui.modal = { type: 'settings' }; break;
      case 'close': ui.modal = null; break;
      case 'lang': S.lang = el.dataset.v; save(); break;
      case 'theme': S.theme = el.dataset.v; save(); break;
      case 'newGroup': ui.modal = { type: 'group', focus: 'gname' }; ui.form = { name: '', emoji: '🏠', currency: 'EGP', members: [], err: '' }; break;
      case 'gemoji': ui.form.emoji = el.dataset.e; break;
      case 'gdelm': ui.form.members.splice(+el.dataset.i, 1); break;
      case 'gaddm': { var inp = document.getElementById('gmem'), nm = addMemberTo(ui.form.members, inp.value); ui.form.err = nm === 'dup' ? t('dupName') : ''; if (nm && nm !== 'dup') ui.form.members.push(nm); ui.modal.focus = 'gmem'; break; }
      case 'gsave': {
        var pend = document.getElementById('gmem').value.trim(); if (pend && addMemberTo(ui.form.members, pend) !== 'dup') ui.form.members.push(pend);
        if (!ui.form.name.trim()) { ui.form.err = t('groupName'); break; }
        if (ui.form.members.length < 2) { ui.form.err = t('needMembers'); break; }
        var ng = { id: uid(), name: ui.form.name.trim(), emoji: ui.form.emoji, currency: ui.form.currency, members: ui.form.members.map(function (n) { return { id: uid(), name: n }; }), expenses: [], payments: [] };
        S.groups.unshift(ng); save(); ui.modal = null; location.hash = '#/g/' + ng.id + '/exp'; return;
      }
      case 'open': location.hash = '#/g/' + el.dataset.id + '/exp'; return;
      case 'home': location.hash = '#/'; return;
      case 'tab': location.hash = '#/g/' + r.id + '/' + el.dataset.tab; return;
      case 'sample': sample(); save(); break;
      case 'manage': ui.modal = { type: 'manage' }; ui.form = { err: '' }; break;
      case 'madd': { var mi = document.getElementById('mnew'), nm2 = addMemberTo(g.members, mi.value); if (nm2 === 'dup') ui.form.err = t('dupName'); else if (nm2) { g.members.push({ id: uid(), name: nm2 }); ui.form.err = ''; save(); } ui.modal.focus = 'mnew'; break; }
      case 'mdel': if (C.memberInUse(g, el.dataset.id)) ui.form.err = t('inUse'); else { g.members = g.members.filter(function (m) { return m.id !== el.dataset.id; }); ui.form.err = ''; save(); } break;
      case 'msave': { var nn = document.getElementById('mname').value.trim(); if (nn) g.name = nn; save(); ui.modal = null; toast(t('saved')); break; }
      case 'delGroup': if (confirm(t('delGroupConfirm'))) { S.groups = S.groups.filter(function (x) { return x.id !== g.id; }); save(); ui.modal = null; location.hash = '#/'; return render(); } return;
      case 'csv': download('7sebna-' + g.name.replace(/[^\w\u0600-\u06FF]+/g, '_') + '.csv', '\ufeff' + C.toCSV(g), 'text/csv;charset=utf-8'); return;
      case 'addExp': if (g.members.length < 2) { toast(t('needMembers')); return; } ui.modal = { type: 'expense', focus: 'fdesc' }; ui.form = newExpenseForm(g); break;
      case 'editExp': ui.modal = { type: 'expense' }; ui.form = newExpenseForm(g, g.expenses.find(function (e) { return e.id === el.dataset.id; })); break;
      case 'stype': { ui.form.split.type = el.dataset.v; ui.form.split.vals = {}; var all = {}; g.members.forEach(function (m) { all[m.id] = true; }); ui.form.split.who = all; document.getElementById('splits').innerHTML = splitRows(g, ui.form); document.querySelectorAll('.seg [data-a=stype]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.v === el.dataset.v); }); return; }
      case 'esave': {
        var e = buildExpense(g, ui.form), err = C.validateExpense(e);
        if (err) { ui.form.err = t('e_' + err); document.getElementById('ferr').innerHTML = '<div class="note err">' + esc(ui.form.err) + '</div>'; return; }
        var ix = g.expenses.findIndex(function (x) { return x.id === e.id; }); if (ix >= 0) g.expenses[ix] = e; else g.expenses.push(e);
        save(); ui.modal = null; toast(t('saved')); break;
      }
      case 'edel': if (confirm(t('delExpConfirm'))) { g.expenses = g.expenses.filter(function (x) { return x.id !== ui.form.id; }); save(); ui.modal = null; break; } return;
      case 'pay': { var plan = C.settle(C.balances(g)), p = plan[+el.dataset.i]; if (p) { g.payments.push({ id: uid(), from: p.from, to: p.to, amount: p.amount, date: today() }); save(); toast(t('saved')); } break; }
      case 'undoPay': g.payments = g.payments.filter(function (x) { return x.id !== el.dataset.id; }); save(); break;
      case 'copy': { var txt = summary(g); (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { toast(t('copied')); }, function () { window.prompt('', txt); }); return; }
      case 'exportAll': download('7sebna-backup.json', JSON.stringify({ app: '7sebna', version: 1, groups: S.groups }, null, 1), 'application/json'); return;
      case 'importAll': document.getElementById('ifile').click(); return;
      case 'resetAll': if (confirm(t('resetConfirm'))) { S.groups = []; save(); ui.modal = null; location.hash = '#/'; } break;
      default: return;
    }
    render();
  });

  document.addEventListener('input', function (ev) {
    var el = ev.target, g = curGroup();
    if (!ui.modal || ui.modal.type !== 'expense') return;
    if (el.dataset.s) { var sp = ui.form.split; if (sp.type === 'equal') sp.who[el.dataset.s] = el.checked; else sp.vals[el.dataset.s] = el.value; }
    syncFormFields();
    if (ui.form.err) { ui.form.err = ''; var fe = document.getElementById('ferr'); if (fe) fe.innerHTML = ''; }
    var n = document.getElementById('snote'); if (n) n.innerHTML = splitNote(g, ui.form);
  });
  document.addEventListener('change', function (ev) {
    if (ev.target.id !== 'ifile' || !ev.target.files[0]) return;
    var rd = new FileReader();
    rd.onload = function () {
      var d = null; try { d = C.sanitizeImport(JSON.parse(rd.result)); } catch (e) { d = null; }
      if (!d) return toast(t('importBad'));
      var have = {}; S.groups.forEach(function (g) { have[g.id] = 1; });
      d.groups.forEach(function (g) { if (have[g.id]) g.id = uid(); S.groups.push(g); });
      save(); ui.modal = null; render(); toast(t('imported'));
    };
    rd.readAsText(ev.target.files[0]);
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && ui.modal) { ui.modal = null; render(); }
    if (ev.key === 'Enter' && ui.modal && ev.target.tagName === 'INPUT' && ev.target.type !== 'checkbox') {
      var map = { gmem: 'gaddm', mnew: 'madd', fdesc: 'esave', famt: 'esave', gname: 'gsave', mname: 'msave' }, b = map[ev.target.id];
      if (b) { ev.preventDefault(); var btn = document.querySelector('[data-a=' + b + ']'); if (btn) btn.click(); }
    }
  });
  window.addEventListener('hashchange', function () { ui.modal = null; render(); });
  render();
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) navigator.serviceWorker.register('sw.js').catch(function () {});
})();
