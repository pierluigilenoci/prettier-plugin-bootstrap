export default function Card({ title, children }) {
  return (
    <div className="shadow card h-100 p-3">
      <div className="card-body d-flex flex-column">
        <h2 className="fw-bold card-title mb-3">{title}</h2>
        <p className="text-muted card-text flex-grow-1">{children}</p>
        <button className="mt-auto btn btn-primary w-100">Read more</button>
      </div>
    </div>
  )
}
