import React from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "complete" | "current" | "upcoming";

export interface Step {
    id: string;
    name: string;
    status: StepStatus;
}

interface StepperProps {
    steps: Step[];
    className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, className }) => {
    return (
        <nav className={cn("w-full", className)}>
            <ol className="flex w-full justify-between items-center relative">
                {steps.map((step, idx) => {
                    const isLast = idx === steps.length - 1;
                    return (
                        <li
                            key={step.id}
                            className="flex-1 flex flex-col items-center relative"
                        >
                            {/* Progress Bar */}
                            {idx > 0 && (
                                <div
                                    className={cn(
                                        "absolute top-1/2 left-0 -translate-y-1/2 h-1 w-full -z-10",
                                        steps[idx - 1].status === "complete"
                                            ? "bg-primary"
                                            : "bg-gray-200"
                                    )}
                                    style={{
                                        width: "100%",
                                        height: "3px",
                                        zIndex: 0,
                                    }}
                                />
                            )}

                            {/* Step Icon */}
                            <div
                                className={cn(
                                    "flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all duration-200 shadow",
                                    step.status === "complete"
                                        ? "bg-primary text-white border-primary"
                                        : step.status === "current"
                                        ? "bg-white border-primary text-primary animate-pulse"
                                        : "bg-gray-100 border-gray-300 text-gray-400"
                                )}
                                aria-current={
                                    step.status === "current"
                                        ? "step"
                                        : undefined
                                }
                            >
                                {step.status === "complete" ? (
                                    <CheckIcon className="h-5 w-5" />
                                ) : (
                                    <span className="font-semibold text-base">
                                        {idx + 1}
                                    </span>
                                )}
                            </div>

                            {/* Step Label */}
                            <span
                                className={cn(
                                    "mt-2 text-xs font-medium text-center max-w-[90px] truncate",
                                    step.status === "complete"
                                        ? "text-primary"
                                        : step.status === "current"
                                        ? "text-primary"
                                        : "text-gray-400"
                                )}
                                title={step.name}
                            >
                                {step.name}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
