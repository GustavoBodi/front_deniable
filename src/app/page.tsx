"use client";
import React, { useState } from "react";

const API_URL = "/api/vote";
const RESULTS_URL = "/api/results";
const FLUSH_URL = "/api/flush";
const RECEIPT_URL = "/api/receipt";

export default function Home() {
  const [candidate, setCandidate] = useState<string>("Jair Alfeu");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [status2, setStatus2] = useState<"idle" | "loading" | "success" | "error">("idle");
  // status para busca de recibo
  const [status3, setStatus3] = useState<"idle" | "loading" | "success" | "error">("idle");

  const [message, setMessage] = useState<string>("");
  const [nome, setNome] = useState<string>("");
  const [receipt, setReceipt] = useState<any | null>(null);
  const [results, setResults] = useState<
    | {
        results: Record<string, number>;
        total_votes: number;
        winner: string;
      }
    | null
  >(null);

  // estado local para id e resultado do recibo
  const [receiptId, setReceiptId] = useState<string>("");
  const [receiptResult, setReceiptResult] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ candidate, voter_id: nome }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setMessage(data.message ?? "Voto computado com sucesso!");
      setReceipt(data);
      setStatus("success");
    } catch {
      setMessage("Ocorreu um erro ao enviar o voto. Tente novamente.");
      setStatus("error");
    }
  };

  const handleFinishElection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus2("loading");
    try {
      const res = await fetch(RESULTS_URL);
      const res_2 = await fetch(FLUSH_URL, { method: "POST" });
      if (!res.ok || !res_2.ok) throw new Error("Server error");

      const data = await res.json();
      setResults(data);
      setMessage("");
      setStatus2("success");
    } catch {
      setMessage("Ocorreu um erro ao obter os resultados. Tente novamente.");
      setStatus2("error");
    }
  };

  // busca recibo específico
  const handleGetReceipt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!receiptId) return;
    setStatus3("loading");
    try {
      const res = await fetch(`${RECEIPT_URL}/${encodeURIComponent(receiptId)}`);
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setReceiptResult(data);
      setStatus3("success");
    } catch {
      setMessage("Ocorreu um erro ao obter o recibo. Tente novamente.");
      setStatus3("error");
    }
  };

  return (
    <div className="text-black">
      <main className="mt-20">
        <div>
          {/* Formulário de votação */}
          <form className="w-[600px] mx-auto" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="self-center mb-2" htmlFor="nome">
                Nome:
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={nome}
                onChange={(p) => setNome(p.target.value)}
                className="border p-1 rounded"
              />
            </div>

            <div className="flex flex-row gap-20 justify-around mt-4">
              {["Jair Alfeu", "Luiz Ferreira"].map((c) => (
                <label key={c} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={c}
                    name="politico"
                    value={c}
                    checked={candidate === c}
                    onChange={() => setCandidate(c)}
                  />
                  {c}
                </label>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="mt-8 p-2 bg-[#222] text-white rounded disabled:opacity-50"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Enviando..." : "Enviar voto"}
              </button>
            </div>

            {message && (
              <p
                className={`mt-4 text-center ${
                  status === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            {receipt && (
              <pre className="mt-4 bg-gray-50 p-4 rounded border whitespace-pre-wrap text-sm">
                {JSON.stringify(receipt, null, 2)}
              </pre>
            )}
          </form>

          <form className="mx-auto flex justify-center" onSubmit={handleFinishElection}>
            <button
              type="submit"
              className="mx-auto mt-8 p-2 bg-[#222] text-white rounded disabled:opacity-50"
              disabled={status2 === "loading"}
            >
              {status2 === "loading" ? "Carregando..." : "Ver Eleições"}
            </button>
          </form>

          {results && (
            <pre className="mt-6 mx-auto max-w-[300px] bg-gray-50 p-4 rounded border whitespace-pre-wrap text-sm">
              {JSON.stringify(results, null, 2)}
            </pre>
          )}

          {/* Recibo */}
          <form className="mx-auto flex flex-col items-center" onSubmit={handleGetReceipt}>
            <label className="mt-8 mb-2" htmlFor="receiptId">
              Recibo ID:
            </label>
            <input
              type="text"
              id="receiptId"
              name="receiptId"
              value={receiptId}
              onChange={(e) => setReceiptId(e.target.value)}
              className="border p-1 rounded"
            />
            <button
              type="submit"
              className="mt-4 p-2 bg-[#222] text-white rounded disabled:opacity-50"
              disabled={status3 === "loading"}
            >
              {status3 === "loading" ? "Carregando..." : "Ver Recibo"}
            </button>
          </form>

          {receiptResult && (
            <pre className="mt-6 mx-auto max-w-[800px] bg-gray-50 p-4 rounded border whitespace-pre-wrap text-sm">
              {JSON.stringify(receiptResult, null, 2)}
            </pre>
          )}
        </div>
      </main>
      <footer></footer>
    </div>
  );
}

