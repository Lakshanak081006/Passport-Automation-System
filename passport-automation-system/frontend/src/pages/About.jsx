export default function About() {
  const items = [
    ["🎯 Purpose", "To replace manual, paper-based passport processing with a simple, transparent digital workflow."],
    ["⚡ Benefits of automation", "Faster processing, fewer errors, no lost files and less waiting for both applicants and officers."],
    ["📍 Application tracking", "Applicants can see the exact stage of their application and the full history of every change."],
    ["✉️ Email notifications", "Automatic emails on registration, submission and every status change keep applicants informed."],
    ["💻 Digital processing", "Authorised Status Changers review applications, add remarks and update the status online, with every action recorded."],
  ];
  return (
    <div className="page">
      <h1 className="page-title">About the System</h1>
      <div className="grid-2">
        {items.map(([title, text]) => (
          <div className="card" key={title}>
            <h3 className="card-title">{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
