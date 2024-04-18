'use client'

export default function Home() {
  function logACB() {
    console.log("Clicked!");
  }

  return (
    <div>
      <button onClick={logACB}>Click me to console log!</button>
    </div>
  );
}
