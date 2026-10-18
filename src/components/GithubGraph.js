import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import "./GithubGraph.css";

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
const WEEKS = 52;
const DAYS = 7;

async function fetchGithubContributions(username, signal) {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}`,
    { signal },
  );
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`"${username}" wasn't found on GitHub`);
    }
    throw new Error(`GitHub data request failed (${res.status})`);
  }
  const data = await res.json();
  if (!data || !Array.isArray(data.contributions)) {
    throw new Error("Unexpected response from contributions service");
  }
  const map = new Map();
  for (const day of data.contributions) {
    const level = Math.max(0, Math.min(4, Number(day.level)));
    map.set(day.date, { count: Number(day.count) || 0, level });
  }
  return map;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function gridEndDate(map) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!map) return today;
  const windowStart = new Date(today);
  windowStart.setDate(windowStart.getDate() - (WEEKS * DAYS - 1));
  const startKey = toDateKey(windowStart);
  for (const [key, value] of map) {
    if (value.count > 0 && key >= startKey) return today;
  }
  let latest = null;
  for (const [key, value] of map) {
    if (value.count > 0 && (!latest || key > latest)) latest = key;
  }
  return latest ? parseDateKey(latest) : today;
}

function buildGrid(map, weeks, daysPerWeek, endDate) {
  const totalDays = weeks * daysPerWeek;
  const cursor = new Date(endDate);
  cursor.setHours(0, 0, 0, 0);
  const flatDays = [];
  for (let i = totalDays - 1; i >= 0; i -= 1) {
    const d = new Date(cursor);
    d.setDate(d.getDate() - i);
    const key = toDateKey(d);
    const found = map?.get(key);
    flatDays.push({
      date: key,
      level: found ? found.level : 0,
      count: found ? found.count : 0,
    });
  }
  const result = [];
  for (let w = 0; w < weeks; w += 1) {
    result.push(flatDays.slice(w * daysPerWeek, w * daysPerWeek + daysPerWeek));
  }
  return result;
}

export function GithubGraph({ username }) {
  const reduceMotion = !!useReducedMotion();
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [liveMap, setLiveMap] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setErrorMessage("");
    fetchGithubContributions(username, controller.signal)
      .then((map) => {
        setLiveMap(map);
        setStatus("success");
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setLiveMap(null);
        setStatus("error");
        setErrorMessage(err?.message || "Couldn't load GitHub contributions");
      });
    return () => controller.abort();
  }, [username]);

  useEffect(() => {
    if (reduceMotion) {
      setInView(true);
      return undefined;
    }
    const el = containerRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const endDate = useMemo(
    () => gridEndDate(status === "success" ? liveMap : null),
    [liveMap, status],
  );
  const grid = useMemo(
    () =>
      buildGrid(status === "success" ? liveMap : null, WEEKS, DAYS, endDate),
    [liveMap, status, endDate],
  );
  const rangeLabel = useMemo(() => {
    const end = endDate.toLocaleDateString(undefined, {
      month: "short",
      year: "numeric",
    });
    return `52 weeks ending ${end} · @${username}`;
  }, [endDate, username]);

  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    grid.forEach((week, weekIndex) => {
      const firstDated = week.find((d) => d.date);
      if (!firstDated?.date) return;
      const month = parseDateKey(firstDated.date).getMonth();
      if (month !== lastMonth) {
        labels.push({ weekIndex, label: MONTH_NAMES[month] });
        lastMonth = month;
      }
    });
    return labels;
  }, [grid]);

  const shouldAnimate = !reduceMotion && inView;
  const statusLine =
    status === "loading"
      ? `Loading @${username}'s contributions…`
      : status === "error"
        ? `${errorMessage} — see the profile on GitHub.`
        : null;

  return (
    <div className="github-graph" ref={containerRef}>
      <div>
        <div className="github-graph-title">Contribution activity</div>
        <div className="github-graph-sub">{rangeLabel}</div>
        {statusLine && (
          <div className="github-graph-status">
            {status === "error" ? (
              <>
                {errorMessage} — see{" "}
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                .
              </>
            ) : (
              statusLine
            )}
          </div>
        )}
      </div>

      <div className="github-graph-scroll">
        <div className="github-graph-body">
          <div className="github-graph-weekdays">
            {WEEKDAY_LABELS.map((label, index) => (
              <div className="github-graph-weekday" key={index}>
                {label}
              </div>
            ))}
          </div>
          <div className="github-graph-grid-wrap">
            <div className="github-graph-months">
              {monthLabels.map(({ weekIndex, label }) => (
                <span
                  className="github-graph-month"
                  key={`${label}-${weekIndex}`}
                  style={{ left: `${(weekIndex / WEEKS) * 100}%` }}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="github-graph-grid">
              {grid.map((week, weekIndex) =>
                week.map((day, dayIndex) => {
                  const cellIndex = weekIndex * DAYS + dayIndex;
                  return (
                    <button
                      type="button"
                      key={`${weekIndex}-${dayIndex}`}
                      className={`github-graph-cell${shouldAnimate ? " is-animated" : ""}`}
                      style={{
                        backgroundColor: COLORS[day.level],
                        animationDelay: `${Math.min(cellIndex, WEEKS * DAYS) * 6}ms`,
                        gridColumn: weekIndex + 1,
                        gridRow: dayIndex + 1,
                      }}
                      aria-label={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                      onMouseEnter={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        setHovered({ day, x: rect.left, y: rect.top });
                      }}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        setHovered({ day, x: rect.left, y: rect.top });
                      }}
                      onBlur={() => setHovered(null)}
                    />
                  );
                }),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="github-graph-legend">
        <span>Less</span>
        {COLORS.map((color) => (
          <span
            className="github-graph-swatch"
            key={color}
            style={{ background: color }}
          />
        ))}
        <span>More</span>
      </div>

      {hovered && (
        <div
          className="github-graph-tip"
          style={{ left: hovered.x, top: hovered.y - 36 }}
        >
          {hovered.day.count ?? 0} contribution
          {hovered.day.count === 1 ? "" : "s"}
          {hovered.day.date ? ` on ${hovered.day.date}` : ""}
        </div>
      )}
    </div>
  );
}
