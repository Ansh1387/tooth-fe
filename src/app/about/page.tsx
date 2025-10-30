export default function AboutPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2>About DentalXrayAI</h2>
      <p>
        DentalXrayAI is a demo dashboard for visualizing object detection on
        dental X-ray images. It connects to a Flask backend that exposes a
        <code>POST /detect</code> endpoint returning bounding boxes with labels
        and probabilities.
      </p>
      <h3>How it works</h3>
      <ul>
        <li>Upload an X-ray image on the Detection page.</li>
        <li>The image is sent to the backend as multipart form-data.</li>
        <li>The response is rendered as a table, with optional overlay.</li>
      </ul>
      <h3>Credits</h3>
      <p>
        Built with Next.js, Tailwind CSS, and lucide-react icons. Backend by
        Flask.
      </p>
    </div>
  );
}


