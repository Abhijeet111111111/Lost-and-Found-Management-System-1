export default function Stat({ logo, backgroundColor, title, desc }) {
  return (
    <div
      className={`${backgroundColor} w-84 min-w-64 md:w-84 rounded-xl h-44 flex flex-col items-center justify-center gap-2 p-6`}
    >
      <img className="w-16 border-2 border-stone-500 rounded-full" src={logo} />
      <h1 className=" font-extrabold text-lg md:text-3xl text-stone-100">
        {title}
      </h1>
      <p className="font-semibold text-sm uppercase tracking-wide text-stone-100">
        {desc}
      </p>
    </div>
  );
}
