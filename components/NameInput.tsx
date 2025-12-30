
import React, { useState, useMemo } from 'react';
import { Student } from '../types';

interface NameInputProps {
  onNamesSubmit: (names: Student[]) => void;
  initialNames: Student[];
}

const NameInput: React.FC<NameInputProps> = ({ onNamesSubmit, initialNames }) => {
  const [inputText, setInputText] = useState(initialNames.map(n => n.name).join('\n'));

  const sampleNames = [
    "陳小明", "李美玲", "張大衛", "林志強", "王小芬", 
    "黃雅婷", "郭俊宏", "吳淑珍", "蔡文傑", "曾信輝",
    "許家豪", "曹育誠", "彭瑞雲", "呂宜婷", "馬英華",
    "羅國雄", "梁婉珍", "宋健平", "馮美慧", "鄧志明"
  ];

  const currentNames = useMemo(() => {
    return inputText.split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);
  }, [inputText]);

  const duplicates = useMemo(() => {
    const seen = new Set<string>();
    const dups = new Set<string>();
    currentNames.forEach(name => {
      if (seen.has(name)) {
        dups.add(name);
      }
      seen.add(name);
    });
    return Array.from(dups);
  }, [currentNames]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const names = text.split(/[\n,]/)
        .map(n => n.trim())
        .filter(n => n.length > 0);
      setInputText(names.join('\n'));
    };
    reader.readAsText(file);
  };

  const loadSampleList = () => {
    setInputText(sampleNames.join('\n'));
  };

  const removeDuplicates = () => {
    const unique = Array.from(new Set(currentNames));
    setInputText(unique.join('\n'));
  };

  const handleSubmit = () => {
    const names = currentNames.map((name, index) => ({ id: `${Date.now()}-${index}`, name }));
    onNamesSubmit(names);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">步驟 1：設置學生名單</h2>
        <button 
          onClick={loadSampleList}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full transition-colors"
        >
          使用範例名單
        </button>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-600 mb-2">
          方式 A：上傳 CSV 或文字檔
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">點擊上傳</span> 或拖放檔案</p>
              <p className="text-xs text-slate-400">支援 CSV 或 TXT (每行一個姓名)</p>
            </div>
            <input type="file" className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-600 mb-2">
          方式 B：直接貼上姓名
        </label>
        <textarea
          className="w-full h-64 p-4 text-slate-700 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none font-sans text-base"
          placeholder="請在此貼上姓名，每行一個..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>

      {duplicates.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-bold text-amber-800">偵測到重複姓名！</p>
              <p className="text-xs text-amber-700">重複項：{duplicates.join(', ')}</p>
            </div>
          </div>
          <button 
            onClick={removeDuplicates}
            className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-colors"
          >
            一鍵移除重複
          </button>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!inputText.trim()}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        儲存名單並繼續
      </button>
    </div>
  );
};

export default NameInput;
