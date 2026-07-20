function Rating({ value }) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {value >= star ? "⭐" : "☆"}
        </span>
      ))}
    </div>
  );
}

export default Rating;