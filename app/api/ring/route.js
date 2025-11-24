return new ImageResponse(
  (
    <svg width="300" height="300" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="54" stroke="#333" strokeWidth="12" fill="none"/>
      <circle
        cx="60"
        cy="60"
        r="54"
        stroke="#00ff88"
        strokeWidth="12"
        fill="none"
        strokeDasharray={`${score * 3.4} 999`}
        transform="rotate(-90 60 60)"
      />
      <text
        x="50%"
        y="50%"
        fontSize="32"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#111"
      >
        {score}
      </text>
    </svg>
  ),
  { width: 300, height: 300 }
);
