
import React, { useState, useEffect, useRef } from 'react';
import { Student } from '../types';

interface RandomPickerProps {
  students: Student[];
}

const RandomPicker: React.FC<RandomPickerProps> = ({ students }) => {
  const [canRepeat, setCanRepeat] = useState(false);
  const [remaining, setRemaining] = useState<Student[]>([...students]);
  const [history, setHistory] = useState<Student[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentPick, setCurrentPick] = useState<Student | null>(null);
  const [displayList, setDisplayList] = useState<Student[]>([]);

  useEffect(() => {
    setRemaining([...students]);
    setHistory([]);
  }, [students]);

  const spin = () => {
    if (isSpinning) return;
    
    const pool = canRepeat ? students : remaining;
    if (pool.length === 0) {
      alert("名單中已經沒有剩餘的學生了！");
      return;
    }

    setIsSpinning(true);
    setCurrentPick(null);
    
    const shuffleList = Array.from({ length: 20 }, () => pool[Math.floor(Math.random() * pool.length)]);
    const winner = pool[Math.floor(Math.random() * pool.length)];
    shuffleList.push(winner);
    setDisplayList(shuffleList);

    let duration = 3000;
    setTimeout(() => {
      setIsSpinning(false);
      setCurrentPick(winner);
      setHistory(prev => [winner, ...prev]);
      if (!canRepeat) {
        setRemaining(prev => prev.filter(s => s.id !== winner.id));
      }
    }, duration);
  };

  const resetPool = () => {
    if (confirm("確定要重置抽籤池嗎？這將會清除目前的抽籤紀錄。")) {
      setRemaining([...students]);
      setHistory([]);
      setCurrentPick(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-slate-800">抽籤設定</h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input 
                type="checkbox" 
                className="w-5 h-5 text-indigo-600 rounded"
                checked={canRepeat}
                onChange={(e) => setCanRepeat(e.target.checked)}
              />
              <span className="text-slate-700 font-medium">允許重複抽取</span>
            </label>
            
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="text-sm text-indigo-600 font-semibold mb-1 uppercase tracking-wider">目前抽籤池</div>
              <div className="flex justify-between items-end">
                <span className="text-3xl font-bold text-indigo-900">{canRepeat ? students.length : remaining.length}</span>
                <span className="text-indigo-600 pb-1">位學生</span>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <button
              onClick={spin}
              disabled={isSpinning || (!canRepeat && remaining.length === 0)}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
            >
              {isSpinning ? '挑選中...' : '開始抽籤'}
            </button>
            <button
              onClick={resetPool}
              className="w-full py-2 text-slate-500 hover:text-slate-700 font-medium text-sm"
            >
              重置抽籤池
            </button>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-6 bg-slate-800 text-white font-bold flex justify-between items-center">
            <span>隨機抽籤展示</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-10 relative overflow-hidden bg-slate-900">
            {isSpinning ? (
              <div className="relative h-24 overflow-hidden w-full flex flex-col items-center">
                 <div className="animate-slot flex flex-col items-center">
                   {displayList.map((s, i) => (
                     <div key={i} className="h-24 flex items-center justify-center text-4xl md:text-5xl font-black text-indigo-400 opacity-50">
                        {s.name}
                     </div>
                   ))}
                 </div>
                 <div className="absolute inset-0 border-y-4 border-indigo-500 pointer-events-none z-10"></div>
                 <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900 pointer-events-none z-10"></div>
              </div>
            ) : currentPick ? (
              <div className="text-center animate-bounce">
                <div className="text-indigo-400 text-sm font-bold tracking-widest uppercase mb-2">恭喜抽中</div>
                <div className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_0_20px_rgba(129,140,248,0.8)]">
                  {currentPick.name}
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-lg font-medium italic">準備好開始抽籤了嗎？</div>
            )}
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 animate-slide-up">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            最近抽取紀錄
          </h3>
          <div className="flex flex-wrap gap-3">
            {history.map((s, i) => (
              <div 
                key={`${s.id}-${i}`} 
                className={`px-4 py-2 rounded-lg font-semibold border ${i === 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700 scale-105' : 'bg-slate-50 border-slate-100 text-slate-500'} transition-all`}
              >
                {s.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomPicker;
