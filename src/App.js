import { useState } from "react";

export default function App() {

  // ================= CORE =================
  const [step, setStep] = useState("agent");
  const [agentName, setAgentName] = useState("");

  const [data, setData] = useState({});
  const [leads, setLeads] = useState([]);

  // ================= DATA =================
  const updateData = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // ================= RESET =================
  const reset = () => {
    setStep("opening");
    setData({});
  };

  // ================= LEAD ID =================
  const nextId = () => leads.length + 1;

  // ================= SAVE LEAD =================
  const saveLead = () => {
    const newLead = {
      id: nextId(),
      agent: agentName,
      data,
      timestamp: new Date().toISOString(),
    };

    setLeads((prev) => [...prev, newLead]);
  };

  // ================= EXPORT CSV =================
  const exportCSV = () => {
    const rows = leads
      .map(
        (l) =>
          `${l.id},${l.agent},${JSON.stringify(l.data).replaceAll(",", ";")}`
      )
      .join("\n");

    const csv = "id,agent,data\n" + rows;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  // ================= CALCULATOR =================
  const value = Number(data.estimated_value || 0);
  const lowOffer = value ? Math.round(value * 0.7) : 0;
  const highOffer = value ? Math.round(value * 0.9) : 0;

  return (
    <div style={{ display: "flex", fontFamily: "Arial" }}>

      {/* LEFT SIDE */}
      <div style={{ width: "60%", padding: 20 }}>
        <h2>📞 Cold Calling CRM</h2>

        {/* ================= AGENT ================= */}
        {step === "agent" && (
          <>
            <h3>Enter Your Name</h3>

            <input
              placeholder="Agent Name"
              onChange={(e) => setAgentName(e.target.value)}
            />

            <button
              onClick={() => {
                if (agentName) setStep("opening");
              }}
            >
              Start Call
            </button>
          </>
        )}

        {/* ================= OPENING ================= */}
        {step === "opening" && (
          <>
            <p>Hi, am I speaking with [Name]?</p>
            <button onClick={() => setStep("intro")}>Yes</button>
          </>
        )}

        {/* ================= INTRO ================= */}
        {step === "intro" && (
          <>
            <p>
              My name is {agentName}, and I’m calling regarding the property at [Full Address].
              Are you the owner?
            </p>

            <button onClick={() => setStep("owner_yes")}>Yes</button>
            <button onClick={() => setStep("owner_no")}>No</button>
          </>
        )}

        {/* ================= OWNER YES ================= */}
        {step === "owner_yes" && (
          <>
            <p>
              I work with Prime Home Buyers, and I was calling to see if you’d be interested in a cash offer.
            </p>

            <button onClick={() => setStep("permission")}>Yes</button>
            <button onClick={() => setStep("future_3_6")}>No</button>
          </>
        )}

        {/* ================= 3–6 MONTH ================= */}
        {step === "future_3_6" && (
          <>
            <p>
              Totally understand — how about in the next 3 to 6 months, would you consider selling?
            </p>

            <button onClick={() => setStep("permission")}>Yes</button>
            <button onClick={() => setStep("owner_no")}>No</button>
          </>
        )}

        {/* ================= OWNER NO ================= */}
        {step === "owner_no" && (
          <>
            <p>Do you own any other property you might be interested in selling?</p>

            <button
              onClick={() => {
                saveLead();
                setData({});
                setStep("condition");
              }}
            >
              Yes
            </button>

            <button onClick={() => setStep("closing")}>No</button>
          </>
        )}

        {/* ================= PERMISSION ================= */}
        {step === "permission" && (
          <>
            <p>
              Since I’m calling on a recorded line, can I ask a couple of questions regarding the property’s condition?
            </p>

            <button onClick={() => setStep("condition")}>Yes</button>
            <button onClick={() => setStep("closing")}>No</button>
          </>
        )}

        {/* ================= CONDITION ================= */}
        {step === "condition" && (
       <>
  <h3>🏠 Condition Questions</h3>

  <input
    placeholder="Bedrooms & Bathrooms"
    onChange={(e) => updateData("beds", e.target.value)}
  />

  <input
    placeholder="Property Type"
    onChange={(e) => updateData("type", e.target.value)}
  />

  <input
    placeholder="Roof Age"
    onChange={(e) => updateData("roof", e.target.value)}
  />

  <input
    placeholder="Foundation Condition"
    onChange={(e) => updateData("foundation", e.target.value)}
  />

  <input
    placeholder="HVAC Age"
    onChange={(e) => updateData("hvac", e.target.value)}
  />

  <input
    placeholder="Plumbing / Water Tank"
    onChange={(e) => updateData("plumbing", e.target.value)}
  />

  <input
    placeholder="Kitchen & Bathrooms Condition"
    onChange={(e) => updateData("kitchen", e.target.value)}
  />

  <input
    placeholder="Minor Updates Needed"
    onChange={(e) => updateData("updates", e.target.value)}
  />

  <input
    placeholder="Overall Rating (1–10)"
    onChange={(e) => updateData("rating", e.target.value)}
  />

  <input
    placeholder="Sewer System & Oil Tank"
    onChange={(e) => updateData("sewer_oil", e.target.value)}
  />

  {/* ================= VACANT LAND ================= */}
  <h3>🌳 Vacant Land Only</h3>

  <input
    placeholder="Parcel Number"
    onChange={(e) => updateData("parcel_number", e.target.value)}
  />

  <input
    placeholder="Size (Acres or Sqft)"
    onChange={(e) => updateData("land_size", e.target.value)}
  />

  <h4>⚡ Access to Utilities</h4>

  {["Water", "Electricity", "Gas", "TV Cable"].map((item) => {
    const utilities = Array.isArray(data.utilities)
      ? data.utilities
      : [];

    return (
      <div key={item}>
        <label>
          <input
            type="checkbox"
            checked={utilities.includes(item)}
            onChange={() => {
              if (utilities.includes(item)) {
                updateData(
                  "utilities",
                  utilities.filter((u) => u !== item)
                );
              } else {
                updateData("utilities", [...utilities, item]);
              }
            }}
          />
          {" "}{item}
        </label>
      </div>
    );
  })}

  <br />

  <button onClick={() => setStep("ownership_length")}>
  Continue
</button>
  </>
)}
{/* ================= OWNERSHIP LENGTH ================= */}
{step === "ownership_length" && (
  <>
    <p>How long have you owned this property?</p>

    <input
      placeholder="e.g. 5 years"
      onChange={(e) => updateData("ownership_length", e.target.value)}
    />

    <button onClick={() => setStep("occupancy")}>
      Continue
    </button>
  </>
)}
        {/* ================= OCCUPANCY ================= */}
        {step === "occupancy" && (
          <>
            <p>Do you currently live in it, is it vacant, or rented?</p>

            <button onClick={() => setStep("listing")}>Owner Occupied</button>
            <button onClick={() => setStep("listing")}>Vacant</button>
            <button onClick={() => setStep("rented")}>Rented</button>
          </>
        )}
      

        {/* ================= RENTED ================= */}
        {step === "rented" && (
          <>
            <p>Month-to-month or yearly lease?</p>

            <button onClick={() => setStep("listing")}>Month-to-Month</button>
            <button onClick={() => setStep("listing")}>Yearly</button>
          </>
        )}

        {/* ================= LISTING ================= */}
        {step === "listing" && (
          <>
            <p>Is the property listed on the market?</p>

            <button onClick={() => setStep("listing_details")}>Yes</button>
            <button onClick={() => setStep("listing_history")}>No</button>
          </>
        )}

        {step === "listing_details" && (
          <>
            <p>By yourself or with a realtor?</p>
            <button onClick={() => setStep("motivation")}>Realtor</button>
            <button onClick={() => setStep("motivation")}>Self</button>
          </>
        )}

        {step === "listing_history" && (
          <>
            <p>Was it previously listed?</p>
            <button onClick={() => setStep("motivation")}>Yes</button>
            <button onClick={() => setStep("motivation")}>No</button>
          </>
        )}

        {/* ================= MOTIVATION ================= */}
        {step === "motivation" && (
          <>
            <p>Aside from money, what made you consider selling?</p>
            <input onChange={(e) => updateData("motivation", e.target.value)} />
            <button onClick={() => setStep("price")}>Continue</button>
          </>
        )}

        {/* ================= PRICE ================= */}
        {step === "price" && (
          <>
            <p>Do you have an asking price or ballpark?
              (write here market value)
            </p>
            <input onChange={(e) => updateData("estimated_value", e.target.value)} />
            <button onClick={() => setStep("ballpark")}>Continue</button>
          </>
        )}

        {/* ================= BALLPARK ================= */}
        {step === "ballpark" && (
          <>
            <h3>📊 Offer Range</h3>
            <p>
              Okay, I’ll give you a ballpark estimate of what our offer might look like.
              This isn’t the final offer—just a range. How does that sound?
            </p>

            <p>💰 {lowOffer} – {highOffer}</p>

            <button onClick={() => setStep("mortgage")}>Continue</button>
          </>
        )}

        {/* ================= MORTGAGE ================= */}
{step === "mortgage" && (
  <>
    <p>Do you have any mortgage or lien on the property?</p>

    <button onClick={() => setStep("mortgage_amount")}>Yes</button>
    <button onClick={() => setStep("timeline")}>No</button>
  </>
)}

{/* ================= MORTGAGE AMOUNT ================= */}
{step === "mortgage_amount" && (
  <>
    <p>How much is left on the mortgage or lien?</p>

    <input
      placeholder="Amount remaining"
      onChange={(e) => updateData("mortgage_amount", e.target.value)}
    />

    <button onClick={() => setStep("timeline")}>
      Continue
    </button>
  </>
)}

        {/* ================= TIMELINE ================= */}
        {step === "timeline" && (
          <>
            <p>When would you like to sell?</p>
            <input onChange={(e) => updateData("timeline", e.target.value)} />
            <button onClick={() => setStep("confirm")}>Continue</button>
          </>
        )}

        {/* ================= CONFIRM ================= */}
      {step === "confirm" && (
  <>
    <p>
      So to set your expectations, I’ll take this information to our pricing team to build an offer
      and you should be getting a callback from our cash buyer with the final offer and to answer
      any further questions.
    </p>

    <p>
      And since today’s date is <b>{new Date().toLocaleDateString()}</b>, you should get this call
      within 2 business days. Will you be okay with that?
    </p>

    <button onClick={() => setStep("callback_time")}>Yes</button>
    <button onClick={() => setStep("upsell")}>No</button>
  </>
)}
{/* ================= CALLBACK TIME ================= */}
{step === "callback_time" && (
  <>
    <h3>📅 Schedule Callback</h3>

    <p>When do you prefer this call?</p>

    <input
      type="date"
      onChange={(e) => updateData("callback_date", e.target.value)}
    />

    <input
      type="time"
      onChange={(e) => updateData("callback_time", e.target.value)}
    />

    <br /><br />

    <button onClick={() => setStep("upsell")}>
      Continue
    </button>
  </>
)}
        {/* ================= UPSELL ================= */}
        {step === "upsell" && (
          <>
            <p>
              Before I let you go, do you have any other properties you might be interested in selling?
            </p>

            <button
              onClick={() => {
                saveLead();
                setData({});
                setStep("condition");
              }}
            >
              Yes
            </button>

            <button onClick={() => setStep("email")}>No</button>
          </>
        )}

{/* ================= EMAIL ================= */}
{step === "email" && (
  <>
    <p>Can I get your email address?</p>

    <input
      placeholder="example@email.com"
      onChange={(e) => updateData("email", e.target.value)}
    />

    <button onClick={() => setStep("confirmation_block")}>
      Continue
    </button>
  </>
)}

        {/* ================= FINAL CONFIRMATION ================= */}
        {step === "confirmation_block" && (
          <>
            <h3>✅ Confirmation</h3>

            <p><b>Just to confirm:</b></p>
            <p>Your full name: {data.name || "[Name]"}</p>
            <p>Property address: {data.address || "[Full Address]"}</p>

            <button
              onClick={() => {
                saveLead();
                setStep("done");
              }}
            >
              Confirm & Finish
            </button>
          </>
        )}

        {/* ================= DONE ================= */}
        {step === "done" && (
          <>
            <h3>Thank you for your time!</h3>
            <button onClick={reset}>New Call</button>
          </>
        )}

        {/* ================= CLOSING ================= */}
        {step === "closing" && (
          <>
            <p>Thank you for your time, have a great day!</p>
            <button onClick={reset}>New Call</button>
          </>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div style={{ width: "40%", padding: 20, background: "#f4f4f4" }}>
        <h3>📊 Leads Dashboard</h3>

        <button onClick={exportCSV}>Export CSV</button>

        {leads.map((l) => (
          <p key={l.id}>
            #{l.id} - {l.agent}
          </p>
        ))}
      </div>

    </div>
  );
}