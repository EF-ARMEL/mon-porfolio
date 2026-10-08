"use client";

import React, { useActionState } from "react";
import { sendContact, ContactState } from "@/app/actions/contact";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendContact, { ok: false });

  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
      <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Honeypot */}
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase text-white/50 ml-1">Nom</label>
          <input
            type="text"
            name="nom"
            defaultValue={state.values?.nom}
            className={`bg-white/5 border ${state.errors?.nom ? 'border-orange-500' : 'border-white/10'} text-white p-3 rounded-xl outline-none transition-all focus:border-brand-orange`}
            placeholder="Jean Dupont"
          />
          {state.errors?.nom && <span className="text-[10px] text-orange-500 font-medium ml-1">{state.errors.nom}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase text-white/50 ml-1">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={state.values?.email}
            className={`bg-white/5 border ${state.errors?.email ? 'border-orange-500' : 'border-white/10'} text-white p-3 rounded-xl outline-none transition-all focus:border-brand-orange`}
            placeholder="jean@exemple.com"
          />
          {state.errors?.email && <span className="text-[10px] text-orange-500 font-medium ml-1">{state.errors.email}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase text-white/50 ml-1">Téléphone</label>
          <input
            type="tel"
            name="tel"
            defaultValue={state.values?.tel}
            className={`bg-white/5 border ${state.errors?.tel ? 'border-orange-500' : 'border-white/10'} text-white p-3 rounded-xl outline-none transition-all focus:border-brand-orange`}
            placeholder="+33 6 00 00 00 00"
          />
          {state.errors?.tel && <span className="text-[10px] text-orange-500 font-medium ml-1">{state.errors.tel}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase text-white/50 ml-1">Type de Projet</label>
          <input
            type="text"
            name="projet"
            defaultValue={state.values?.projet}
            className={`bg-white/5 border ${state.errors?.projet ? 'border-orange-500' : 'border-white/10'} text-white p-3 rounded-xl outline-none transition-all focus:border-brand-orange`}
            placeholder="Ex: Site E-commerce, App SaaS"
          />
          {state.errors?.projet && <span className="text-[10px] text-orange-500 font-medium ml-1">{state.errors.projet}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase text-white/50 ml-1">Budget estimé</label>
          <input
            type="text"
            name="budget"
            defaultValue={state.values?.budget}
            className={`bg-white/5 border ${state.errors?.budget ? 'border-orange-500' : 'border-white/10'} text-white p-3 rounded-xl outline-none transition-all focus:border-brand-orange`}
            placeholder="Ex: 2000€ - 5000€"
          />
          {state.errors?.budget && <span className="text-[10px] text-orange-500 font-medium ml-1">{state.errors.budget}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase text-white/50 ml-1">Délai souhaité</label>
          <input
            type="text"
            name="delai"
            defaultValue={state.values?.delai}
            className={`bg-white/5 border ${state.errors?.delai ? 'border-orange-500' : 'border-white/10'} text-white p-3 rounded-xl outline-none transition-all focus:border-brand-orange`}
            placeholder="Ex: 1 mois"
          />
          {state.errors?.delai && <span className="text-[10px] text-orange-500 font-medium ml-1">{state.errors.delai}</span>}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-xs font-bold tracking-widest uppercase text-white/50 ml-1">Message</label>
          <textarea
            name="message"
            defaultValue={state.values?.message}
            rows={4}
            className={`bg-white/5 border ${state.errors?.message ? 'border-orange-500' : 'border-white/10'} text-white p-3 rounded-xl outline-none transition-all focus:border-brand-orange resize-none`}
            placeholder="Décrivez votre besoin en quelques mots..."
          />
          {state.errors?.message && <span className="text-[10px] text-orange-500 font-medium ml-1">{state.errors.message}</span>}
        </div>

        <div className="md:col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            disabled={isPending}
            className="relative group overflow-hidden px-10 py-4 rounded-full bg-brand-orange text-black font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-3">
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoyé en cours...
                </>
              ) : (
                "Lancer le projet"
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {state.message && (
          <div className={`md:col-span-2 p-4 rounded-xl flex items-center gap-3 text-sm font-medium transition-all duration-300 ${state.ok ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {state.ok ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {state.message}
          </div>
        )}
      </form>
    </div>
  );
}
