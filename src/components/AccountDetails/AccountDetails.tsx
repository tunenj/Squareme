"use client";

import Image from "next/image";
import React, { useState } from "react";

const OnlinePayments: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const accountNumber = "8000000000";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="relative mt-8 p-1 lg:mt-14 flex justify-center sm:justify-start">
            <div className="sm:max-w-xs w-full flex flex-col sm:items-start">
                <h2 className="text-lg font-semibold border-b-2 border-[#3976E8] w-40 pb-2 mb-6 sm:text-left">
                    Online Payments
                </h2>
                <div
                    className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 w-full sm:w-[325px] h-[115px]"
                    style={{ gap: "6px" }}
                >
                    <div className="">
                        <p className="text-xs text-gray-400 mb-2 uppercase">Account Details</p>
                        <p className="text-xs font-bold mb-2">STERLING BANK</p>
                    </div>

                    {/* Copy button */}
                    <div className="flex justify-between">
                        <p className="font-extrabold text-xl">{accountNumber}</p>
                        <button
                            onClick={copyToClipboard}
                            className={`bg-[#9F56D433] text-[#9F56D4] rounded-xl px-3 py-1 text-xs font-semibold flex items-center
                          transition-colors whitespace-nowrap
                           ${copied ? "bg-[#9F56D4] text-[#9F56D4]" : "bg-[#9F56D4] text-[#9F56D4]"}`}
                        >
                            <Image
                                src='/icons/copy.png'
                                alt="Copy"
                                width={14}
                                height={14}
                                className="mr-1"
                            />
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnlinePayments;