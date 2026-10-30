import { useEffect, useState } from "react";
import { Moon, Sun, Globe, AlarmClock, Trash2 } from "lucide-react";
import "./App.css";

function WorldClock({ city, country, timezone, flag, time }) {
  const worldTime = time.toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const worldDate = time.toLocaleDateString("en-US", {
    timeZone: timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const zone = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "short",
  })
    .formatToParts(time)
    .find((part) => part.type === "timeZoneName")?.value;

  return (
    <div className="world-clock-item">
      <div className="city-info">
        <span className="flag">{flag}</span>
        <div>
          <strong>{city}</strong>
          <small>{country}</small>
        </div>
      </div>

      <div className="world-time">{worldTime}</div>

      <div className="world-bottom">
        <span>{worldDate}</span>
        <span>{zone}</span>
      </div>
    </div>
  );
}

function App() {
  const [time, setTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") !== "false"
  );

  const [is24Hour, setIs24Hour] = useState(
    localStorage.getItem("is24Hour") === "true"
  );

  const [alarms, setAlarms] = useState(() => {
    const saved = localStorage.getItem("alarms");
    return saved ? JSON.parse(saved) : [];
  });
  const [alarmTime, setAlarmTime] = useState("");
  const [alarmLabel, setAlarmLabel] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const currentTime = time.toTimeString().slice(0, 5);

    setAlarms((currentAlarms) =>
      currentAlarms.map((alarm) => {
        if (
          alarm.enabled &&
          alarm.time === currentTime &&
          !alarm.triggered
        ) {
          alert(`⏰ Alarm: ${alarm.label}`);

          return {
            ...alarm,
            triggered: true,
          };
        }

        if (alarm.time !== currentTime) {
          return {
            ...alarm,
            triggered: false,
          };
        }

        return alarm;
      })
    );
  }, [time]);

  useEffect(() => {
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("is24Hour", is24Hour);
  }, [is24Hour]);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourRotation = (hours % 12) * 30 + minutes * 0.5;
  const minuteRotation = minutes * 6 + seconds * 0.1;
  const secondRotation = seconds * 6;

  const digitalTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !is24Hour,
  });

  const dateText = time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const addAlarm = () => {
    if (!alarmTime) {
      alert("Please select an alarm time.");
      return;
    }

    const newAlarm = {
      id: Date.now(),
      time: alarmTime,
      label: alarmLabel || "Alarm",
      enabled: true,
      triggered: false,
    };

    setAlarms((previous) => [...previous, newAlarm]);
    setAlarmTime("");
    setAlarmLabel("");
  };

  const toggleAlarm = (id) => {
    setAlarms((previous) =>
      previous.map((alarm) =>
        alarm.id === id
          ? {
              ...alarm,
              enabled: !alarm.enabled,
              triggered: false,
            }
          : alarm
      )
    );
  };

  const deleteAlarm = (id) => {
    setAlarms((previous) =>
      previous.filter((alarm) => alarm.id !== id)
    );
  };

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <header className="header">
        <div>
          <h1>World Clock</h1>
          <p>Real-time global time dashboard</p>
        </div>

        <div className="controls">
          <button onClick={() => setIs24Hour(!is24Hour)}>
            {is24Hour ? "12H" : "24H"}
          </button>

          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="dashboard">

        {/* ANALOG CLOCK */}
        <section className="card analog-card">
          <div className="card-title">
            <Globe size={20} />
            <span>Local Time</span>
          </div>

          <div className="analog-clock">
            <div
              className="hand hour-hand"
              style={{
                transform: `rotate(${hourRotation}deg)`,
              }}
            />

            <div
              className="hand minute-hand"
              style={{
                transform: `rotate(${minuteRotation}deg)`,
              }}
            />

            <div
              className="hand second-hand"
              style={{
                transform: `rotate(${secondRotation}deg)`,
              }}
            />

            <div className="clock-center" />

            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="number"
                style={{
                  transform: `rotate(${i * 30}deg) translateY(-115px) rotate(-${
                    i * 30
                  }deg)`,
                }}
              >
                {i === 0 ? 12 : i}
              </span>
            ))}
          </div>

          <div className="location">
            <strong>India</strong>
            <span>Asia/Kolkata</span>
          </div>
        </section>

        {/* DIGITAL CLOCK */}
        <section className="card digital-card">
          <div className="card-title">
            <AlarmClock size={20} />
            <span>Digital Clock</span>
          </div>

          <div className="digital-time">{digitalTime}</div>

          <div className="date">{dateText}</div>

          <div className="timezone">
            <span>IST</span>
            <span>UTC +5:30</span>
          </div>
        </section>

        {/* WORLD CLOCKS */}
        <section className="card world-card">
          <div className="card-title">
            <Globe size={20} />
            <span>World Clocks</span>
          </div>

          <div className="world-clocks">
            <WorldClock
              city="New York"
              country="USA"
              timezone="America/New_York"
              flag="🇺🇸"
              time={time}
            />

            <WorldClock
              city="London"
              country="UK"
              timezone="Europe/London"
              flag="🇬🇧"
              time={time}
            />

            <WorldClock
              city="Tokyo"
              country="Japan"
              timezone="Asia/Tokyo"
              flag="🇯🇵"
              time={time}
            />

            <WorldClock
              city="Dubai"
              country="UAE"
              timezone="Asia/Dubai"
              flag="🇦🇪"
              time={time}
            />
          </div>
        </section>

        {/* ALARMS */}
        <section className="card alarm-card">
          <div className="card-title">
            <AlarmClock size={20} />
            <span>Alarms</span>
          </div>

          <div className="alarm-form">
            <input
              type="time"
              value={alarmTime}
              onChange={(e) => setAlarmTime(e.target.value)}
            />

            <input
              type="text"
              placeholder="Alarm label"
              value={alarmLabel}
              onChange={(e) => setAlarmLabel(e.target.value)}
            />

            <button onClick={addAlarm}>+ Add Alarm</button>
          </div>

          <div className="alarm-list">
            {alarms.length === 0 ? (
              <div className="no-alarms">
                <div>⏰</div>
                <p>No alarms set</p>
              </div>
            ) : (
              alarms.map((alarm) => (
                <div className="alarm-item" key={alarm.id}>
                  <div>
                    <strong>{alarm.time}</strong>
                    <span>{alarm.label}</span>
                  </div>

                  <div className="alarm-actions">
                    <button
                      className={
                        alarm.enabled ? "enabled" : "disabled"
                      }
                      onClick={() => toggleAlarm(alarm.id)}
                    >
                      {alarm.enabled ? "ON" : "OFF"}
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteAlarm(alarm.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;