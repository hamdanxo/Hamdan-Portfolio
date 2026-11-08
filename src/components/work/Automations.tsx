

export default function Automations() {
  return (
    <>
<section className="cat" id="cat-automations" data-cat="automations">
<div className="cat-head"><div><h2 className="cat-name">Automations &amp; Systems</h2><p className="cat-desc">Tools that remove repetitive work and keep business data clean.</p></div><span className="cat-count">01 project</span></div>
<div className="cat-list"><article className="cs glass">
<div className="cs-top">
<span className="cs-num">01</span>
<div className="cs-name"><span className="cs-kicker">Lapiz Blue · 2026</span><h3 className="cs-title">Lead Staging System</h3></div>
<div className="cs-tags"><span className="chip">Automation</span><span className="chip">Internal tool</span></div>
</div>
<div className="cs-body">
<div className="cs-visual"><div className="flow" aria-label="How the lead staging system works">
<div className="flow-row">
<div className="node"><span className="node-k">Source</span><b>Counter form</b><small>Walk in enquiries</small></div>
<div className="node"><span className="node-k">Source</span><b>Leads inbox</b><small>Email enquiries</small></div>
<div className="node node-ghost"><span className="node-k">Next</span><b>WhatsApp</b><small>Planned</small></div>
</div>
<div className="flow-line" aria-hidden="true"></div>
<div className="node node-main">
<div className="node-headrow"><span className="node-k">Staging area</span><span className="node-tag">Sample draft</span></div>
<b>Review before it counts</b>
<small>AI pre-fills the details, the team checks and edits</small>
<div className="draft">
<div><span>Company</span><em>Sample Contracting LLC</em></div>
<div><span>Salesman</span><em>Auto assigned</em></div>
<div><span>Source</span><em>Email</em></div>
<div><span>Quantity</span><em>120 bags</em></div>
</div>
<div className="draft-btn">Push to CRM</div>
</div>
<div className="flow-line" aria-hidden="true"></div>
<div className="node"><span className="node-k">Destination</span><b>Zoho CRM</b><small>One click, assigned to the next salesman in turn</small></div>
<div className="flow-line flow-line-dim" aria-hidden="true"></div>
<div className="node node-ghost"><span className="node-k">In progress</span><b>Reports</b><small>By week, month, salesman and brand</small></div>
</div></div>
<div className="cs-text">
<div className="cs-block"><h4>Overview</h4><p>A lead pipeline I built for Lapiz Blue, a construction chemicals distributor in Dubai. It gathers incoming leads in one place, lets the sales team check them, and sends clean leads straight into Zoho CRM.</p></div>
<div className="cs-block"><h4>The problem</h4><p>Leads arrived through different channels and were typed into the CRM by hand, which was slow and easy to get wrong.</p></div>
<div className="cs-block"><h4>What it does</h4><ol className="cs-steps"><li><span>01</span><p>Pulls new leads from the counter form and the leads email inbox with one Fetch Leads button</p></li><li><span>02</span><p>AI reads free text enquiries and pre-fills the lead details</p></li><li><span>03</span><p>The team reviews each lead as an editable draft: company, salesman, source, quantity, category and products</p></li><li><span>04</span><p>Clean leads go to Zoho CRM in one click, assigned to the next salesman in turn</p></li></ol></div>
<div className="cs-block"><h4>Built with</h4><div className="cs-chips"><span className="chip">Supabase</span><span className="chip">Vercel</span><span className="chip">GitHub</span><span className="chip">Zoho CRM API</span><span className="chip">Groq AI</span></div></div>
<div className="cs-foot"><span className="cs-status"><i></i>Ongoing · reports next</span><span className="cs-note">Internal company tool</span></div>
</div>
</div>
</article></div>
</section>
    </>
  );
}
