// TextInput.js
export default function TextInput({ value, onChange }) {
  return (
    <textarea className="App-input" value={value} onChange={onChange} />
  );
}
