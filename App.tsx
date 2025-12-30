
import React, { useState } from 'react';
import { Student, ViewState } from './types';
import NameInput from './components/NameInput';
import RandomPicker from './components/RandomPicker';
import Grouper from './components/Grouper';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('input');
  const [students, setStudents] = useState<Student[]>([]);

  const handleNamesSubmit = (names: Student[]) => {
    setStudents(names);
    setView('picker');
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">
                SMART<span className="text-indigo-600">TEACHER</span>
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setView('input')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'input' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                1. 名單管理
              </button>
              <button 
                onClick={() => setView('picker')}
                disabled={students.length === 0}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'picker' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 disabled:opacity-50'}`}
              >
                2. 隨機抽籤
              </button>
              <button 
                onClick={() => setView('grouper')}
                disabled={students.length === 0}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'grouper' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 disabled:opacity-50'}`}
              >
                3. 自動分組
              </button>
            </nav>

            <div className="flex items-center">
               <div className="hidden sm:block text-right mr-4">
                  <div className="text-xs font-bold text-slate-400 uppercase">目前名單</div>
                  <div className="text-sm font-bold text-slate-700">{students.length} 位學生</div>
               </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {view === 'input' && (
          <NameInput onNamesSubmit={handleNamesSubmit} initialNames={students} />
        )}
        
        {view === 'picker' && students.length > 0 && (
          <RandomPicker students={students} />
        )}

        {view === 'grouper' && students.length > 0 && (
          <Grouper students={students} />
        )}

        {students.length === 0 && view !== 'input' && (
           <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             </div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">等一下！</h2>
             <p className="text-slate-500 mb-8">您需要先添加學生名單才能使用此功能。</p>
             <button 
               onClick={() => setView('input')}
               className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
             >
               前往名單設置
             </button>
           </div>
        )}
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 z-50">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setView('input')}
            className={`flex flex-col items-center gap-1 ${view === 'input' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-[10px] font-bold uppercase">名單</span>
          </button>
          <button 
            onClick={() => setView('picker')}
            disabled={students.length === 0}
            className={`flex flex-col items-center gap-1 ${view === 'picker' ? 'text-indigo-600' : 'text-slate-400 opacity-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-bold uppercase">抽籤</span>
          </button>
          <button 
            onClick={() => setView('grouper')}
            disabled={students.length === 0}
            className={`flex flex-col items-center gap-1 ${view === 'grouper' ? 'text-indigo-600' : 'text-slate-400 opacity-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-[10px] font-bold uppercase">分組</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
