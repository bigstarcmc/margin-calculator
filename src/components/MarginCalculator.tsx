import React, { useState, useEffect } from "react";

export default function MarginCalculator() {
  const [salePrice, setSalePrice] = useState<number>(1700);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [purchasePrice, setPurchasePrice] = useState<number>(1000);
  const [extraCost, setExtraCost] = useState<number>(0);
  const [operationCost, setOperationCost] = useState<number>(0);
  const [desiredMarginRateInput, setDesiredMarginRateInput] = useState<string>("30");
  const [categoryFee, setCategoryFee] = useState<number>(10);
  const [linkFee, setLinkFee] = useState<number>(0);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [includeShippingInMargin, setIncludeShippingInMargin] = useState<boolean>(false);
  const [isManualSalePrice, setIsManualSalePrice] = useState(false);
  const [showMarginLimitModal, setShowMarginLimitModal] = useState(false);

  const feeRate = (categoryFee + linkFee) / 100;
  const shippingProfit = shippingCost - (shippingCost * (deliveryFee / 100));
  const adjustedOperationCost = includeShippingInMargin ? operationCost : 0;
  const totalCost = purchasePrice + extraCost + adjustedOperationCost;

  const netRevenue = salePrice * (1 - feeRate);
  const marginAmount = netRevenue - totalCost;
  const totalProfit = marginAmount + (includeShippingInMargin ? shippingProfit : 0);
  const displayedMarginRate = netRevenue > 0 ? Math.round((totalProfit / netRevenue) * 1000) / 10 : 0;

  useEffect(() => {
    const parsed = parseFloat(desiredMarginRateInput);
    if (!isNaN(parsed) && !isManualSalePrice) {
      if (parsed > 80) {
        setShowMarginLimitModal(true);
      }
      const cappedRate = Math.min(parsed, 80);
      const targetProfit = totalCost - (includeShippingInMargin ? shippingProfit : 0);
      const targetRevenue = targetProfit / (1 - cappedRate / 100);
      const newSalePrice = targetRevenue / (1 - feeRate);
      setSalePrice(Math.round(newSalePrice));
    }
  }, [desiredMarginRateInput, totalCost, feeRate, isManualSalePrice, includeShippingInMargin, shippingCost, deliveryFee]);

  useEffect(() => {
    if (isManualSalePrice) {
      const currentNet = salePrice * (1 - feeRate);
      const margin = currentNet - totalCost;
      const totalProfit = margin + (includeShippingInMargin ? shippingProfit : 0);
      const newRate = currentNet > 0 ? (totalProfit / currentNet) * 100 : 0;
      const cappedRate = Math.min(newRate, 80);
      setDesiredMarginRateInput(cappedRate.toFixed(1));
    }
  }, [salePrice, totalCost, feeRate, isManualSalePrice, includeShippingInMargin, shippingCost, deliveryFee]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa] px-4">
      <div className="w-full max-w-md bg-white shadow-lg p-8 rounded-2xl border border-gray-200">
        <div className="text-center mb-6">
          <div className="bg-[#FFD31A] rounded px-4 py-3 w-full">
            <h1 className="text-xl font-bold text-black">
              📈 위탁플러스 마진율 계산기
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">실제 정산 기준으로 수익을 계산하세요.</p>
        </div>

        <div className="flex justify-between items-center bg-[#FFD31A] text-gray-800 font-semibold px-3 py-2 rounded mb-4">
          <label>목표 마진율 (%)</label>
          <input
            type="text"
            value={desiredMarginRateInput}
            onChange={e => setDesiredMarginRateInput(e.target.value)}
            className="w-24 border px-2 py-1 rounded-md shadow-sm text-right"
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm text-gray-700">배송비 포함 마진:</label>
          <input
            type="checkbox"
            checked={includeShippingInMargin}
            onChange={() => setIncludeShippingInMargin(prev => !prev)}
          />
        </div>

        <div className="bg-[#FFD31A] text-gray-800 font-semibold px-3 py-2 rounded mb-2">결과</div>
        <div className="text-base mb-4">
          <p>📟 총비용: <strong>{totalCost.toLocaleString()}원</strong></p>
          <p>📦 플랫폼 수수료: <strong>{(salePrice * feeRate).toLocaleString()}원</strong></p>
          <p>💰 순이익: <strong>{totalProfit.toFixed(1)}원</strong></p>
          <p>📊 마진율: <strong className={displayedMarginRate >= 30 ? "text-green-600" : "text-red-500"}>{displayedMarginRate.toFixed(1)}%</strong></p>
        </div>

        <div className="bg-[#FFD31A] text-gray-800 font-semibold px-3 py-2 rounded mb-2">매출</div>
        <div className="flex justify-between items-center mb-2">
          <label>판매가:</label>
          <input type="number" value={salePrice} onChange={e => { setIsManualSalePrice(true); setSalePrice(+e.target.value); }} className="w-32 border px-2 py-1 rounded-md shadow-sm" />
        </div>
        <div className="flex justify-between items-center mb-2">
          <label>배송비:</label>
          <input type="number" value={shippingCost} onChange={e => setShippingCost(+e.target.value)} className="w-32 border px-2 py-1 rounded-md shadow-sm" />
        </div>

        <div className="bg-[#FFD31A] text-gray-800 font-semibold px-3 py-2 rounded mb-2">매입</div>
        <div className="flex justify-between items-center mb-2">
          <label>매입가:</label>
          <input type="number" value={purchasePrice} onChange={e => setPurchasePrice(+e.target.value)} className="w-32 border px-2 py-1 rounded-md shadow-sm" />
        </div>
        <div className="flex justify-between items-center mb-2">
          <label>기타비용(포장비, 사은품 등):</label>
          <input type="number" value={extraCost} onChange={e => setExtraCost(+e.target.value)} className="w-32 border px-2 py-1 rounded-md shadow-sm" />
        </div>
        <div className="flex justify-between items-center mb-2">
          <label>운임비:</label>
          <input type="number" value={operationCost} onChange={e => setOperationCost(+e.target.value)} className="w-32 border px-2 py-1 rounded-md shadow-sm" />
        </div>

        <div className="bg-[#FFD31A] text-gray-800 font-semibold px-3 py-2 rounded mb-2">수수료</div>
        <div className="flex justify-between items-center mb-2">
          <label>카테고리 수수료(%):</label>
          <input type="number" value={categoryFee} onChange={e => setCategoryFee(+e.target.value)} className="w-32 border px-2 py-1 rounded-md shadow-sm" />
        </div>
        <div className="flex justify-between items-center mb-2">
          <label>연동 수수료(%):</label>
          <input type="number" value={linkFee} onChange={e => setLinkFee(+e.target.value)} className="w-32 border px-2 py-1 rounded-md shadow-sm" />
        </div>
        <div className="flex justify-between items-center mb-2">
          <label>배송비 수수료(%):</label>
          <input type="number" value={deliveryFee} onChange={e => setDeliveryFee(+e.target.value)} className="w-32 border px-2 py-1 rounded-md shadow-sm" />
        </div>
      </div>

      {showMarginLimitModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
            <h2 className="text-lg font-bold mb-3">😅 희망 마진율 제한 안내</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              희망 마진율은 <strong className="text-yellow-500">80% 이하</strong>까지만 설정할 수 있어요!{"\n\n"}
              마진과 마진율은 다른 개념이에요!{"\n"}
              마진율이 100%라는 건 '판매가 = 순이익'이라는 뜻인데,{"\n"}
              이건 원가가 0원이어야 가능한 비현실적인 수치예요.{"\n\n"}
              플랫폼 수수료, 부대비용, 배송비까지 고려하면{"\n"}
              80%를 넘기는 순간 수익 계산이 왜곡되거나 손실이 발생할 수 있어요.{"\n\n"}
              그래서 배송비 포함 조건을 고려해 {" "}
              <strong className="text-yellow-500">최대 80%까지만</strong> 설정 가능해요.{"\n\n"}
              🧲 현실적인 목표부터 함께 맞추어 볼게요! 💛
            </p>
            <button
              onClick={() => setShowMarginLimitModal(false)}
              className="mt-5 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded"
            >
              알겠어요 😊
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
