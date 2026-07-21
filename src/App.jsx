import { useState } from "react";

const fmt = (n) => Math.round(n).toLocaleString();

export default function App() {
  const [unit, setUnit]         = useState("metric");
  const [gender, setGender]     = useState("male");
  const [age, setAge]           = useState("");
  const [weight, setWeight]     = useState("");
  const [height, setHeight]     = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal]         = useState("maintain");
  const [result, setResult]     = useState(null);

  const activityLevels = [
    { id: "sedentary",  label: "Sedentary",       desc: "Little or no exercise",         mult: 1.2 },
    { id: "light",      label: "Lightly Active",  desc: "Exercise 1–3 days/week",         mult: 1.375 },
    { id: "moderate",   label: "Moderately Active",desc: "Exercise 3–5 days/week",        mult: 1.55 },
    { id: "active",     label: "Very Active",     desc: "Hard exercise 6–7 days/week",    mult: 1.725 },
    { id: "extreme",    label: "Extremely Active",desc: "Physical job or 2x training/day",mult: 1.9 },
  ];

  const goals = [
    { id: "lose2",     label: "Lose Fast",     desc: "−1 kg/week",   adj: -1000, color: "#ef4444" },
    { id: "lose1",     label: "Lose Weight",   desc: "−0.5 kg/week", adj: -500,  color: "#f97316" },
    { id: "maintain",  label: "Maintain",      desc: "Keep current weight", adj: 0, color: "#6366f1" },
    { id: "gain1",     label: "Gain Weight",   desc: "+0.5 kg/week", adj: 500,   color: "#22c55e" },
    { id: "gain2",     label: "Gain Fast",     desc: "+1 kg/week",   adj: 1000,  color: "#10b981" },
  ];

  const calculate = () => {
    let w, h;
    if (unit === "metric") {
      w = parseFloat(weight);
      h = parseFloat(height);
    } else {
      w = (parseFloat(weightLbs) || 0) / 2.205;
      h = ((parseFloat(heightFt) || 0) * 30.48) + ((parseFloat(heightIn) || 0) * 2.54);
    }
    const a = parseFloat(age);
    if (!w || !h || !a) return;

    // Mifflin-St Jeor BMR
    const bmr = gender === "male"
      ? (10 * w) + (6.25 * h) - (5 * a) + 5
      : (10 * w) + (6.25 * h) - (5 * a) - 161;

    const mult = activityLevels.find(al => al.id === activity)?.mult || 1.55;
    const tdee = bmr * mult;
    const goalAdj = goals.find(g => g.id === goal)?.adj || 0;
    const targetCalories = tdee + goalAdj;

    // Macros for target calories
    const protein   = w * 2.2 * 0.9; // ~1g per lb bodyweight (converted)
    const fat       = targetCalories * 0.25 / 9;
    const carbsCals = targetCalories - (protein * 4) - (fat * 9);
    const carbs     = carbsCals / 4;

    setResult({ bmr, tdee, targetCalories, protein, fat, carbs, weight: w, height: h, goalAdj });
  };

  const reset = () => { setAge(""); setWeight(""); setHeight(""); setWeightLbs(""); setHeightFt(""); setHeightIn(""); setResult(null); };

  const inputStyle = { width: "100%", padding: "10px 14px", fontSize: "15px", border: "1.5px solid #e5e7eb", borderRadius: "10px", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff" };
  const labelStyle = { display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.04em" };

  const activeGoal = goals.find(g => g.id === goal);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "16px 24px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="https://tabutility.com" style={{ fontSize: "15px", fontWeight: "700", color: "#6366f1", textDecoration: "none" }}>⌘ Tabutility</a>
          <span style={{ fontSize: "13px", color: "#6b7280" }}>Free Online Tools</span>
        </div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 16px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px" }}>TDEE & Calorie Calculator</h1>
        <p style={{ fontSize: "15px", color: "#6b7280", margin: "0 0 28px" }}>Calculate your Total Daily Energy Expenditure, BMR, and exact calories for your goal.</p>

        {/* Unit + Gender */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", background: "#f3f4f6", borderRadius: "10px", padding: "4px", gap: "4px" }}>
            {["metric", "imperial"].map(u => (
              <button key={u} onClick={() => { setUnit(u); reset(); }} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "13px", background: unit === u ? "#6366f1" : "transparent", color: unit === u ? "#fff" : "#6b7280" }}>
                {u === "metric" ? "Metric" : "Imperial"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", background: "#f3f4f6", borderRadius: "10px", padding: "4px", gap: "4px" }}>
            {[{ id: "male", label: "♂ Male" }, { id: "female", label: "♀ Female" }].map(g => (
              <button key={g.id} onClick={() => setGender(g.id)} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "13px", background: gender === g.id ? "#6366f1" : "transparent", color: gender === g.id ? "#fff" : "#6b7280" }}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={labelStyle}>Age</label>
              <input type="number" placeholder="e.g. 30" value={age} onChange={e => setAge(e.target.value)} min="10" max="100" style={inputStyle} />
            </div>
            {unit === "metric" ? (
              <>
                <div>
                  <label style={labelStyle}>Weight (kg)</label>
                  <input type="number" placeholder="e.g. 75" value={weight} onChange={e => setWeight(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Height (cm)</label>
                  <input type="number" placeholder="e.g. 175" value={height} onChange={e => setHeight(e.target.value)} style={inputStyle} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label style={labelStyle}>Weight (lbs)</label>
                  <input type="number" placeholder="e.g. 165" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Height (ft / in)</label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input type="number" placeholder="ft" value={heightFt} onChange={e => setHeightFt(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                    <input type="number" placeholder="in" value={heightIn} onChange={e => setHeightIn(e.target.value)} min="0" max="11" style={{ ...inputStyle, flex: 1 }} />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Activity */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ ...labelStyle, marginBottom: "10px" }}>Activity Level</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {activityLevels.map(al => (
                <button key={al.id} onClick={() => setActivity(al.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "10px", border: `1.5px solid ${activity === al.id ? "#6366f1" : "#e5e7eb"}`, background: activity === al.id ? "#f5f3ff" : "#fff", cursor: "pointer", textAlign: "left" }}>
                  <div>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: activity === al.id ? "#6366f1" : "#0f172a" }}>{al.label}</span>
                    <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "8px" }}>{al.desc}</span>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: activity === al.id ? "#6366f1" : "#9ca3af" }}>×{al.mult}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ ...labelStyle, marginBottom: "10px" }}>Your Goal</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {goals.map(g => (
                <button key={g.id} onClick={() => setGoal(g.id)} style={{ flex: "1 1 100px", padding: "10px 8px", borderRadius: "10px", border: `2px solid ${goal === g.id ? g.color : "#e5e7eb"}`, background: goal === g.id ? `${g.color}15` : "#fff", cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: goal === g.id ? g.color : "#374151" }}>{g.label}</div>
                  <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>{g.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button onClick={calculate} disabled={!age || (!weight && !weightLbs)} style={{ width: "100%", padding: "13px", background: (!age || (!weight && !weightLbs)) ? "#e5e7eb" : "#6366f1", color: (!age || (!weight && !weightLbs)) ? "#9ca3af" : "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
            Calculate My TDEE
          </button>
        </div>

        {result && (
          <>
            {/* Main result */}
            <div style={{ background: `linear-gradient(135deg, ${activeGoal.color}dd, ${activeGoal.color}99)`, borderRadius: "20px", padding: "28px", marginBottom: "16px", color: "#fff" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                Daily Calories — {activeGoal.label}
              </div>
              <div style={{ fontSize: "56px", fontWeight: "900", lineHeight: 1 }}>{fmt(result.targetCalories)}</div>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", marginTop: "8px" }}>
                {result.goalAdj !== 0 && `${result.goalAdj > 0 ? "+" : ""}${result.goalAdj} cal vs maintenance`}
              </div>
              <div style={{ display: "flex", gap: "28px", marginTop: "20px", flexWrap: "wrap" }}>
                {[
                  { label: "BMR", value: fmt(result.bmr), desc: "Calories at rest" },
                  { label: "TDEE", value: fmt(result.tdee), desc: "With activity" },
                ].map(({ label, value, desc }) => (
                  <div key={label}>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", textTransform: "uppercase", fontWeight: "700" }}>{label}</div>
                    <div style={{ fontSize: "22px", fontWeight: "900", color: "#fff" }}>{value}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)" }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Macros */}
            <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "16px" }}>
              <h2 style={{ margin: "0 0 16px", fontSize: "17px", fontWeight: "800", color: "#0f172a" }}>Recommended Macros</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {[
                  { label: "Protein", value: Math.round(result.protein), unit: "g", cals: Math.round(result.protein * 4), color: "#6366f1", pct: Math.round((result.protein * 4 / result.targetCalories) * 100) },
                  { label: "Carbs", value: Math.round(result.carbs), unit: "g", cals: Math.round(result.carbs * 4), color: "#f59e0b", pct: Math.round((result.carbs * 4 / result.targetCalories) * 100) },
                  { label: "Fat", value: Math.round(result.fat), unit: "g", cals: Math.round(result.fat * 9), color: "#10b981", pct: Math.round((result.fat * 9 / result.targetCalories) * 100) },
                ].map(m => (
                  <div key={m.label} style={{ textAlign: "center", padding: "16px 8px", background: "#f9fafb", borderRadius: "12px", borderTop: `3px solid ${m.color}` }}>
                    <div style={{ fontSize: "24px", fontWeight: "900", color: m.color }}>{m.value}<span style={{ fontSize: "14px" }}>g</span></div>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginTop: "4px" }}>{m.label}</div>
                    <div style={{ fontSize: "11px", color: "#9ca3af" }}>{m.cals} kcal · {m.pct}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* All goal calories */}
            <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "32px" }}>
              <h2 style={{ margin: "0 0 16px", fontSize: "17px", fontWeight: "800", color: "#0f172a" }}>Calories by Goal</h2>
              {goals.map(g => (
                <div key={g.id} onClick={() => setGoal(g.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: g.color }} />
                    <div>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: goal === g.id ? g.color : "#374151" }}>{g.label}</span>
                      <span style={{ fontSize: "12px", color: "#9ca3af", marginLeft: "8px" }}>{g.desc}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "900", color: goal === g.id ? g.color : "#111827" }}>{fmt(result.tdee + g.adj)} kcal</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ textAlign: "center" }}>
          <a href="https://tabutility.com" style={{ fontSize: "14px", color: "#6366f1", textDecoration: "none", fontWeight: "600" }}>← Back to all free tools</a>
        </div>
      </div>
    </div>
  );
}
