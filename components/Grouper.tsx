
import React, { useState } from 'react';
import { Student, Group, ThemeType } from '../types';
import { generateTeamNames } from '../services/geminiService';

interface GrouperProps {
  students: Student[];
}

const Grouper: React.FC<GrouperProps> = ({ students }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGrouping, setIsGrouping] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>(ThemeType.SPACE);

  const performGrouping = async () => {
    if (students.length === 0) return;
    
    setIsGrouping(true);
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    const numGroups = Math.ceil(shuffled.length / groupSize);
    
    const teamNames = await generateTeamNames(numGroups, selectedTheme);

    const newGroups: Group[] = [];
    for (let i = 0; i < numGroups; i++) {
      newGroups.push({
        id: `group-${i}`,
        name: teamNames[i] || `第 ${i + 1} 組`,
        members: shuffled.slice(i * groupSize, (i + 1) * groupSize),
        theme: selectedTheme
      });
    }

    setGroups(newGroups);
    setIsGrouping(false);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    let csvContent = "組別,學生姓名\n";
    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `${group.name},${member.name}\n`;
      });
    });

    // Add UTF-8 BOM for Excel
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "分組結果.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-6 items-center w-full md:w-auto">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">每組人數</label>
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="2" 
                max="10" 
                value={groupSize} 
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-2xl font-black text-indigo-600 w-8">{groupSize}</span>
            </div>
          </div>

          <div className="space-y-1 w-full md:w-64">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">隊名風格</label>
            <select 
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as ThemeType)}
            >
              {Object.entries(ThemeType).map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {groups.length > 0 && (
            <button
              onClick={downloadCSV}
              className="px-6 py-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              下載 CSV
            </button>
          )}
          <button
            onClick={performGrouping}
            disabled={isGrouping || students.length === 0}
            className="flex-1 md:flex-none px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3"
          >
            {isGrouping ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI 分組中...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                開始自動分組
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groups.map((group, idx) => (
          <div 
            key={group.id} 
            className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow group flex flex-col"
          >
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center group-hover:bg-indigo-50 transition-colors">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">組別 {idx + 1}</span>
              <span className="text-xs font-bold text-slate-400">{group.members.length} 位成員</span>
            </div>
            <div className="p-5 flex-1">
              <h4 className="text-xl font-black text-slate-800 mb-4 line-clamp-1">{group.name}</h4>
              <ul className="space-y-2">
                {group.members.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                      {m.name.charAt(0)}
                    </div>
                    {m.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        
        {groups.length === 0 && !isGrouping && (
          <div className="col-span-full py-20 text-center">
            <div className="text-slate-300 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-slate-400 font-medium">尚未進行分組。點擊上方按鈕開始！</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grouper;
