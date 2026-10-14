"use client";

import { useState } from "react";
import ContactTerminal from "./ContactTerminal";

/**
 * Conteneur du terminal : « ↺ nouveau message » remonte la session avec une
 * clé neuve, ce qui réinitialise tout l'état (champs, journal, erreurs) sans
 * remise à zéro manuelle — façon React, zéro risque d'état résiduel.
 */
export default function ContactTerminalSession() {
  const [session, setSession] = useState(0);

  return <ContactTerminal key={session} onRestart={() => setSession((s) => s + 1)} />;
}
