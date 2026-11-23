/** Découpe un texte en lettres animables (le parent porte l'aria-label du texte complet). */
export default function Chars({ text }: { text: string }) {
  return (
    <>
      {[...text].map((c, i) => (
        <span key={i} className="stk-ch" aria-hidden>
          {c === " " ? " " : c}
        </span>
      ))}
    </>
  );
}
