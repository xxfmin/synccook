"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import EmptyStateImg from "../../../public/img/illustration/sessions-emptystate.webp";
import { useSession } from "next-auth/react";
import { Clock } from "lucide-react";

type Ingredient = { name: string; unit: string; quantity: number };
type TimelineStep = {
  recipe: string;
  originalOrder: number;
  description: string;
  duration: number;
  startOffset: number;
};
type CookSession = {
  _id: string;
  title?: string;
  startTime: string;
  duration: number;
  aggregatedIngredients: Ingredient[];
  combinedTimeline: TimelineStep[];
};

const SessionsPage = () => {
  const { status } = useSession();
  const [sessions, setSessions] = useState<CookSession[] | null>(null);

  useEffect(() => {
    if (status !== "loading") {
      (async () => {
        try {
          const res = await fetch("/api/session");
          if (res.ok) {
            const data: CookSession[] = await res.json();
            setSessions(data);
          } else {
            setSessions([]);
          }
        } catch {
          setSessions([]);
        }
      })();
    }
  }, [status]);

  if (sessions === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-700 font-bold text-2xl">Cooking Sessions</h1>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded cursor-pointer">
          New Session
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg p-8 space-y-4">
          <Image
            src={EmptyStateImg}
            alt="No cooking sessions yet"
            width={180}
            height={180}
            className="pointer-events-none"
          />
          <h2 className="text-2xl font-semibold">You haven’t cooked yet!</h2>
          <p className="text-gray-500">
            Start your first cooking session to see it here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((s) => {
            // join ingredient names for description --> change it to actual description later! 
            const description = s.aggregatedIngredients
              .map((ing) => ing.name)
              .join(", ");

            return (
              <div
                key={s._id}
                className="bg-white rounded-xl shadow p-4 hover:shadow-md transition"
              >
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800">
                  {s.title || "Untitled Session"}
                </h3>

                {/* Description */}
                <p className="mt-1 text-sm text-gray-600">{description}</p>

                {/* Clock + Duration */}
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {s.duration} mins
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
