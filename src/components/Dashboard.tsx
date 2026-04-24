import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Calendar, User, Search, MapPin, BarChart2 } from 'lucide-react';
import { 
  addDays, 
  eachDayOfInterval, 
  format, 
  min, 
  max, 
  parseISO, 
  isValid, 
  differenceInDays,
  startOfWeek
} from 'date-fns';
import { cn, calcDays, calcVariance } from '../lib/utils';
import { TagType, MarketType, Task } from '../types';

const INITIAL_TASKS: Task[] = [
  { id: '1', group: 'NPR GATE', name: 'Charter Preparation', pic: 'Project Owner', status: '', tag: 'ALL', fcstStart: '2026-01-02', fcstEnd: '2026-01-05', actStart: '', actEnd: '', color: 'bg-blue-500' },
  { id: '2', group: 'NPR GATE', name: 'Feeder Submission & Approval', pic: 'Project Owner', status: '', tag: 'ALL', fcstStart: '2026-01-06', fcstEnd: '2026-01-10', actStart: '', actEnd: '', color: 'bg-blue-500' },
  { id: '3', group: 'NPR GATE', name: 'Asia PMR and ER Preparation', pic: 'Project Owner', status: '', tag: 'ALL', fcstStart: '2026-01-11', fcstEnd: '2026-01-12', actStart: '', actEnd: '', color: 'bg-blue-500' },
  { id: '4', group: 'NPR GATE', name: 'Asia PMR Submission & Approval', pic: 'Project Owner', status: '', tag: 'ALL', fcstStart: '2026-01-13', fcstEnd: '2026-01-20', actStart: '', actEnd: '', color: 'bg-blue-500' },
  { id: '5', group: 'NPR GATE', name: 'ATG Project Kickoff', pic: 'Project Owner', status: '', tag: 'ALL', fcstStart: '2026-01-21', fcstEnd: '2026-01-31', actStart: '', actEnd: '', color: 'bg-blue-500' },

  { id: '6', group: 'RECIPE COMPLIANCE', name: 'Recipe compliance', pic: 'SRA', status: '', tag: 'ALL', fcstStart: '2026-02-01', fcstEnd: '2026-02-08', actStart: '', actEnd: '', color: 'bg-emerald-500' },

  { id: '7', group: 'ARTWORK DEVELOPMENT', name: 'Asia Label content sheet', pic: 'Planner', status: '', tag: 'ALL', fcstStart: '2026-02-09', fcstEnd: '2026-02-15', actStart: '', actEnd: '', color: 'bg-purple-500' },
  { id: '8', group: 'ARTWORK DEVELOPMENT', name: 'Legal text/PTS', pic: 'Planner', status: '', tag: 'ALL', fcstStart: '2026-02-16', fcstEnd: '2026-02-18', actStart: '', actEnd: '', color: 'bg-purple-500' },
  { id: '9', group: 'ARTWORK DEVELOPMENT', name: 'Provide new FG code/pack code', pic: 'Planner', status: '', tag: 'ALL', fcstStart: '2026-02-16', fcstEnd: '2026-02-19', actStart: '', actEnd: '', color: 'bg-purple-500' },
  { id: '10', group: 'ARTWORK DEVELOPMENT', name: 'MAW - Artwork Dev and Finalization', pic: 'Planner', status: '', tag: 'ALL', fcstStart: '2026-02-20', fcstEnd: '2026-02-25', actStart: '', actEnd: '', color: 'bg-purple-500' },
  { id: '11', group: 'ARTWORK DEVELOPMENT', name: 'Preflight and AW Release', pic: 'Planner', status: '', tag: 'ALL', fcstStart: '2026-02-26', fcstEnd: '2026-03-03', actStart: '', actEnd: '', color: 'bg-purple-500' },
  { id: '12', group: 'ARTWORK DEVELOPMENT', name: 'Artwork compilation and release to printer', pic: 'Planner', status: '', tag: 'ALL', fcstStart: '2026-03-04', fcstEnd: '2026-03-17', actStart: '', actEnd: '', color: 'bg-purple-500' },
  { id: '13', group: 'ARTWORK DEVELOPMENT', name: '3D packshot', pic: 'Planner', status: '', tag: 'ALL', fcstStart: '2026-03-18', fcstEnd: '2026-03-20', actStart: '', actEnd: '', color: 'bg-purple-500' },

  { id: '14', group: 'ER GATE [ID]', name: 'ER preparation', pic: 'Project Owner', status: '', tag: 'ID', fcstStart: '2026-03-21', fcstEnd: '2026-03-30', actStart: '', actEnd: '', color: 'bg-indigo-500' },
  { id: '15', group: 'ER GATE [ID]', name: 'ER submission to feeder', pic: 'Project Owner', status: '', tag: 'ID', fcstStart: '2026-03-31', fcstEnd: '2026-04-02', actStart: '', actEnd: '', color: 'bg-indigo-500' },
  { id: '16', group: 'ER GATE [ID]', name: 'ER approval in feeder', pic: 'Project Owner', status: '', tag: 'ID', fcstStart: '2026-04-03', fcstEnd: '2026-04-05', actStart: '', actEnd: '', color: 'bg-indigo-500' },
  { id: '17', group: 'ER GATE [ID]', name: 'ER submission to PMR', pic: 'Project Owner', status: '', tag: 'ID', fcstStart: '2026-04-06', fcstEnd: '2026-04-07', actStart: '', actEnd: '', color: 'bg-indigo-500' },
  { id: '18', group: 'ER GATE [ID]', name: 'ER approval in Asia PMR', pic: 'Project Owner', status: '', tag: 'ID', fcstStart: '2026-04-08', fcstEnd: '2026-04-08', actStart: '', actEnd: '', color: 'bg-indigo-500' },
  { id: '19', group: 'ER GATE [ID]', name: 'ER approval in MCA PMR', pic: 'Project Owner', status: '', tag: 'ID', fcstStart: '2026-04-09', fcstEnd: '2026-04-10', actStart: '', actEnd: '', color: 'bg-indigo-500' },

  { id: '20', group: 'PRODUCTION READINESS [ID]', name: 'Place order', pic: 'Planner', status: '', tag: 'ID', fcstStart: '2026-04-12', fcstEnd: '2026-04-13', actStart: '', actEnd: '', color: 'bg-rose-500' },
  { id: '21', group: 'PRODUCTION READINESS [ID]', name: 'Packaging ordering', pic: 'Planner', status: '', tag: 'ID', fcstStart: '2026-04-14', fcstEnd: '2026-04-18', actStart: '', actEnd: '', color: 'bg-rose-500' },
  { id: '22', group: 'PRODUCTION READINESS [ID]', name: 'First Production', pic: 'Planner', status: '', tag: 'ID', fcstStart: '2026-04-19', fcstEnd: '2026-04-21', actStart: '', actEnd: '', color: 'bg-rose-500' },

  { id: '23', group: 'MARKET SHIPMENT TO RFO [ID]', name: 'Shipment (ETD to ETA)', pic: 'Sourcing Unit', status: '', tag: 'ID', fcstStart: '2026-04-22', fcstEnd: '2026-04-25', actStart: '', actEnd: '', color: 'bg-orange-500' },
  { id: '24', group: 'MARKET SHIPMENT TO RFO [ID]', name: 'Custom Clearance', pic: 'Sourcing Unit', status: '', tag: 'ID', fcstStart: '2026-04-26', fcstEnd: '2026-05-02', actStart: '', actEnd: '', color: 'bg-orange-500' },
  { id: '25', group: 'MARKET SHIPMENT TO RFO [ID]', name: 'Ready for order', pic: 'Sourcing Unit', status: '', tag: 'ID', fcstStart: '2026-05-03', fcstEnd: '2026-05-06', actStart: '', actEnd: '', color: 'bg-orange-500' },

  { id: '26', group: 'PRODUCTION READINESS [TH]', name: 'Place order', pic: 'Planner', status: '', tag: 'TH', fcstStart: '2026-04-12', fcstEnd: '2026-04-15', actStart: '', actEnd: '', color: 'bg-emerald-600' },
  { id: '27', group: 'PRODUCTION READINESS [TH]', name: 'Packaging ordering', pic: 'Planner', status: '', tag: 'TH', fcstStart: '2026-04-16', fcstEnd: '2026-04-20', actStart: '', actEnd: '', color: 'bg-emerald-600' },
  { id: '28', group: 'PRODUCTION READINESS [TH]', name: 'First Production', pic: 'Planner', status: '', tag: 'TH', fcstStart: '2026-04-21', fcstEnd: '2026-04-28', actStart: '', actEnd: '', color: 'bg-emerald-600' },

  { id: '29', group: 'MARKET SHIPMENT TO RFO [TH]', name: 'Shipment (ETD to ETA)', pic: 'Sourcing Unit', status: '', tag: 'TH', fcstStart: '2026-04-29', fcstEnd: '2026-05-02', actStart: '', actEnd: '', color: 'bg-cyan-600' },
  { id: '30', group: 'MARKET SHIPMENT TO RFO [TH]', name: 'Custom Clearance', pic: 'Sourcing Unit', status: '', tag: 'TH', fcstStart: '2026-05-03', fcstEnd: '2026-05-05', actStart: '', actEnd: '', color: 'bg-cyan-600' },
  { id: '31', group: 'MARKET SHIPMENT TO RFO [TH]', name: 'Ready for order', pic: 'Sourcing Unit', status: '', tag: 'TH', fcstStart: '2026-05-06', fcstEnd: '2026-05-08', actStart: '', actEnd: '', color: 'bg-cyan-600' },

  { id: '32', group: 'PRODUCTION READINESS [MY, SG, VN]', name: 'Place order', pic: 'Planner', status: '', tag: 'MY, SG, VN', fcstStart: '2026-04-12', fcstEnd: '2026-04-13', actStart: '', actEnd: '', color: 'bg-teal-600' },
  { id: '33', group: 'PRODUCTION READINESS [MY, SG, VN]', name: 'Packaging ordering', pic: 'Planner', status: '', tag: 'MY, SG, VN', fcstStart: '2026-04-14', fcstEnd: '2026-04-18', actStart: '', actEnd: '', color: 'bg-teal-600' },
  { id: '34', group: 'PRODUCTION READINESS [MY, SG, VN]', name: 'First Production', pic: 'Planner', status: '', tag: 'MY, SG, VN', fcstStart: '2026-04-19', fcstEnd: '2026-04-21', actStart: '', actEnd: '', color: 'bg-teal-600' },

  { id: '35', group: 'MARKET SHIPMENT TO RFO  [MY, SG, VN]', name: 'Shipment (ETD to ETA)', pic: 'Sourcing Unit', status: '', tag: 'MY, SG, VN', fcstStart: '2026-04-22', fcstEnd: '2026-04-25', actStart: '', actEnd: '', color: 'bg-amber-500' },
  { id: '36', group: 'MARKET SHIPMENT TO RFO  [MY, SG, VN]', name: 'Custom Clearance', pic: 'Sourcing Unit', status: '', tag: 'MY, SG, VN', fcstStart: '2026-04-26', fcstEnd: '2026-04-27', actStart: '', actEnd: '', color: 'bg-amber-500' },
  { id: '37', group: 'MARKET SHIPMENT TO RFO  [MY, SG, VN]', name: 'Ready for order', pic: 'Sourcing Unit', status: '', tag: 'MY, SG, VN', fcstStart: '2026-04-28', fcstEnd: '2026-04-29', actStart: '', actEnd: '', color: 'bg-amber-500' },
];

const COLORS = ['bg-emerald-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-rose-500', 'bg-orange-500', 'bg-cyan-500'];

const COL_WIDTHS = {
  name: 240,
  pic: 100,
  status: 140,
  tag: 100,
  date: 110,
  dur: 70,
  var: 70
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [marketFilter, setMarketFilter] = useState<MarketType>('ALL');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (marketFilter === 'ALL') return true;
      if (task.tag === 'ALL') return true;
      if (['MY', 'SG', 'VN'].includes(marketFilter) && task.tag === 'MY, SG, VN') return true;
      if (marketFilter === 'ID' && task.tag === 'ID') return true;
      if (marketFilter === 'TH' && task.tag === 'TH') return true;
      return false;
    });
  }, [tasks, marketFilter]);

  const analytics = useMemo(() => {
    let totalEst = 0;
    let totalAct = 0;
    
    filteredTasks.forEach(task => {
      if (task.fcstStart && task.fcstEnd) {
        const start = parseISO(task.fcstStart);
        const end = parseISO(task.fcstEnd);
        if (isValid(start) && isValid(end)) {
          totalEst += differenceInDays(end, start);
        }
      }
      if (task.actStart && task.actEnd) {
        const start = parseISO(task.actStart);
        const end = parseISO(task.actEnd);
        if (isValid(start) && isValid(end)) {
          totalAct += differenceInDays(end, start);
        }
      }
    });

    return { totalEst, totalAct };
  }, [filteredTasks]);

  const updateTask = (id: string, field: keyof Task, value: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const addTask = (groupName?: string, color?: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Task',
      pic: '',
      status: '',
      tag: 'ALL',
      fcstStart: '',
      fcstEnd: '',
      actStart: '',
      actEnd: '',
      color: color || COLORS[Math.floor(Math.random() * COLORS.length)],
      group: groupName || 'New Group'
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const renderItems = useMemo(() => {
    const items: any[] = [];
    const allGroups = Array.from(new Set(tasks.map(t => t.group)));

    allGroups.forEach(groupName => {
      const gTasks = filteredTasks.filter(t => t.group === groupName);
      const color = tasks.find(t => t.group === groupName)?.color || 'bg-slate-500';
      
      items.push({ type: 'header', group: groupName, color });
      gTasks.forEach(task => {
        items.push({ type: 'task', task });
      });
      items.push({ type: 'add-stub', group: groupName, color });
    });

    return items;
  }, [filteredTasks, tasks]);

  // Gantt Chart Logic
  const { timelineStart, timelineEnd, daysItems } = useMemo(() => {
    let allDates: Date[] = [];
    tasks.forEach(t => {
      if (t.fcstStart && isValid(parseISO(t.fcstStart))) allDates.push(parseISO(t.fcstStart));
      if (t.fcstEnd && isValid(parseISO(t.fcstEnd))) allDates.push(parseISO(t.fcstEnd));
      if (t.actStart && isValid(parseISO(t.actStart))) allDates.push(parseISO(t.actStart));
      if (t.actEnd && isValid(parseISO(t.actEnd))) allDates.push(parseISO(t.actEnd));
    });

    if (allDates.length === 0) {
      const today = new Date();
      allDates = [today, addDays(today, 30)];
    }

    const minDate = min(allDates);
    const maxDate = max(allDates);

    const start = startOfWeek(addDays(minDate, -7));
    const end = addDays(maxDate, 14);

    const ds = eachDayOfInterval({ start, end });
    return { timelineStart: start, timelineEnd: end, daysItems: ds };
  }, [tasks]);

  const dayWidth = 30; // px
  const timelineWidth = daysItems.length * dayWidth;

  return (
    <div className="h-full flex overflow-hidden bg-slate-50">
      <aside className="w-16 flex-none bg-slate-900 flex flex-col items-center py-6 gap-6 z-40">
        <div className="w-10 h-10 bg-violet-400 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-violet-950" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
        </div>
        <nav className="flex flex-col gap-6">
          <div className="w-8 h-8 rounded text-slate-400 hover:text-white flex items-center justify-center cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          </div>
          <div className="w-8 h-8 rounded text-slate-400 hover:text-white flex items-center justify-center bg-slate-800 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          </div>
          <div className="w-8 h-8 rounded text-slate-400 hover:text-white flex items-center justify-center cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800">Timeline Monitoring</h1>
            <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-xs font-medium uppercase tracking-wider">Project Tracking</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-slate-500">Market:</label>
              <div className="relative">
                <select 
                  value={marketFilter}
                  onChange={(e) => setMarketFilter(e.target.value as MarketType)}
                  className="appearance-none bg-slate-100 border border-slate-200 text-slate-700 text-sm rounded-md pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-400 cursor-pointer"
                >
                  <option value="ALL">All Markets</option>
                  <option value="MY">Malaysia (MY)</option>
                  <option value="SG">Singapore (SG)</option>
                  <option value="VN">Vietnam (VN)</option>
                  <option value="ID">Indonesia (ID)</option>
                  <option value="TH">Thailand (TH)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <button 
              onClick={addTask}
              className="flex items-center px-4 py-1.5 bg-violet-400 hover:bg-violet-500 text-violet-950 hover:text-white rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Task
            </button>
          </div>
        </header>

        {/* Analytics Summary Bar */}
        <div className="flex gap-4 p-4 shrink-0 bg-white border-b border-slate-200 z-20 shadow-sm relative">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col items-center justify-center">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Estimated Lead Time</span>
            <span className="text-3xl font-bold text-slate-800">{analytics.totalEst} Days</span>
          </div>
          <div className={cn("flex-1 border rounded-lg p-5 flex flex-col items-center justify-center transition-colors", 
            analytics.totalAct > analytics.totalEst 
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-slate-50 border-slate-200 text-slate-800"
          )}>
            <span className={cn("text-sm font-semibold uppercase tracking-wider mb-1", analytics.totalAct > analytics.totalEst ? "text-red-700" : "text-slate-500")}>
              Total Actual Lead Time
            </span>
            <span className="text-3xl font-bold">{analytics.totalAct} Days</span>
          </div>
        </div>

        {/* Outer content container mimicking the geometric theme white wrapper */}
        <div className="flex-1 flex min-h-0 bg-white m-4 mt-0 rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
          
          {/* Shared scroll container */}
          <div className="flex-1 overflow-auto bg-slate-50 relative">
            <div className="flex min-w-max">
              
              {/* LEFT PANE: TABLE */}
              <div className="sticky left-0 z-30 flex-none bg-white border-r border-slate-200 flex flex-col">
                
                {/* Table Header */}
                <div className="sticky top-0 z-40 bg-slate-50 h-10 border-b border-slate-200 flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 select-none">
                  <div className="w-[30px] shrink-0" />
                  <div style={{ width: COL_WIDTHS.name }} className="px-3">Task Description</div>
                  <div style={{ width: COL_WIDTHS.pic }} className="px-3 text-center">PIC</div>
                  <div style={{ width: COL_WIDTHS.status }} className="px-3 text-center">Status</div>
                  <div style={{ width: COL_WIDTHS.tag }} className="px-3 text-center">Market</div>
                  <div style={{ width: COL_WIDTHS.date * 2 + COL_WIDTHS.dur }} className="flex items-center justify-center border-l border-slate-200 h-full">Forecast</div>
                  <div style={{ width: COL_WIDTHS.date * 2 + COL_WIDTHS.dur + COL_WIDTHS.var }} className="flex items-center justify-center border-l border-slate-200 h-full">Actual & Lead Time</div>
                </div>

              {/* Table Body */}
            <div className="flex flex-col bg-white">
              {renderItems.map((item, idx) => {
                if (item.type === 'header') {
                  return (
                    <div key={`header-${item.group}-${idx}`} className={`flex h-10 border-b border-slate-200 shadow-[inset_0_2px_0_var(--tw-shadow-color)] bg-slate-100/50 items-center text-xs font-bold ${item.color.replace('bg-', 'text-')} pl-4 shrink-0`} style={{"--tw-shadow-color": "currentColor"} as React.CSSProperties}>
                      <div className={`w-3 h-3 rounded-sm ${item.color} mr-2`} />
                      {item.group}
                    </div>
                  );
                }
                
                if (item.type === 'add-stub') {
                  return (
                    <div key={`add-${item.group}-${idx}`} className="flex h-10 border-b border-slate-100 items-center px-4 hover:bg-slate-50 cursor-pointer transition-colors shrink-0" onClick={() => addTask(item.group, item.color)}>
                      <Plus className="w-4 h-4 text-slate-400 mr-2" />
                      <span className="text-slate-400 text-sm font-medium">Add Task</span>
                    </div>
                  );
                }

                const task = item.task;
                return (
                <div key={task.id} className="flex h-12 shrink-0 border-b border-slate-100 group hover:bg-slate-50 transition-colors relative items-center text-sm">
                  <div className="w-[30px] flex items-center justify-center shrink-0 border-l-[3px] border-transparent relative" style={{borderLeftColor: task.color.replace('bg-', 'var(--color-)')}}>
                    <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition-opacity absolute z-10 flex items-center justify-center inset-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded mx-auto group-hover:opacity-0 transition-opacity" />
                  </div>
                  
                  {/* Name */}
                  <div style={{ width: COL_WIDTHS.name }} className="flex items-center px-2 font-medium">
                    <input 
                      className="input-geometric truncate"
                      value={task.name}
                      onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                      placeholder="Task name"
                    />
                  </div>
                  
                  {/* PIC */}
                  <div style={{ width: COL_WIDTHS.pic }} className="flex justify-center items-center px-1">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700 relative group/pic">
                       <span className="group-hover/pic:opacity-0 transition-opacity uppercase">{task.pic ? task.pic.substring(0, 2) : '?'}</span>
                       <input 
                          className="absolute inset-0 opacity-0 group-hover/pic:opacity-100 bg-white text-center text-[10px] input-geometric focus:opacity-100 text-slate-800 rounded-full"
                          value={task.pic}
                          onChange={(e) => updateTask(task.id, 'pic', e.target.value)}
                          placeholder="PIC"
                        />
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{ width: COL_WIDTHS.status }} className="flex items-center justify-center px-1 relative h-full group/status py-1">
                    <div className={cn("w-full h-full flex items-center justify-center text-[11px] font-bold uppercase cursor-pointer rounded-sm text-white overflow-hidden text-center shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]", 
                      task.status === 'Done' ? 'bg-emerald-500' : 
                      task.status === 'Working on it' ? 'bg-amber-400' :
                      task.status === 'Stuck' ? 'bg-red-500' : 'bg-slate-300'
                    )}>
                      {!task.status ? 'Set Status' : task.status}
                    </div>
                    <select
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      value={task.status || ''}
                      onChange={(e) => updateTask(task.id, 'status', e.target.value)}
                    >
                      <option value="">Set Status</option>
                      <option value="Done">Done</option>
                      <option value="Working on it">Working on it</option>
                      <option value="Stuck">Stuck</option>
                    </select>
                  </div>

                  {/* Market Tag */}
                  <div style={{ width: COL_WIDTHS.tag }} className="flex items-center justify-center px-2">
                    <select 
                      className="w-full text-[10px] bg-violet-100/50 text-violet-700 px-1.5 py-0.5 rounded font-bold uppercase text-center outline-none cursor-pointer hover:bg-violet-100 border-none appearance-none"
                      value={task.tag}
                      onChange={(e) => updateTask(task.id, 'tag', e.target.value as TagType)}
                    >
                      <option value="ALL">ALL</option>
                      <option value="MY, SG, VN">MY, SG, VN</option>
                      <option value="ID">ID</option>
                      <option value="TH">TH</option>
                    </select>
                  </div>

                  {/* FCST */}
                  <div style={{ width: COL_WIDTHS.date }} className="flex items-center px-1 border-l border-slate-100 h-full">
                    <input 
                      type="date"
                      className="w-full bg-transparent px-1 outline-none text-[11px] text-slate-400 text-center cursor-pointer font-medium"
                      value={task.fcstStart}
                      onChange={(e) => updateTask(task.id, 'fcstStart', e.target.value)}
                    />
                  </div>
                  <div style={{ width: COL_WIDTHS.date }} className="flex items-center px-1 h-full">
                    <input 
                      type="date"
                      className="w-full bg-transparent px-1 outline-none text-[11px] text-slate-400 text-center cursor-pointer font-medium"
                      value={task.fcstEnd}
                      onChange={(e) => updateTask(task.id, 'fcstEnd', e.target.value)}
                    />
                  </div>
                  <div style={{ width: COL_WIDTHS.dur }} className="flex items-center justify-center text-[11px] text-slate-400 h-full">
                    {calcDays(task.fcstStart, task.fcstEnd)}d
                  </div>

                  {/* ACTUAL */}
                  <div style={{ width: COL_WIDTHS.date }} className="flex items-center px-1 border-l border-slate-100 h-full">
                    <input 
                      type="date"
                      className="w-full bg-transparent px-1 outline-none text-[11px] text-slate-600 font-medium text-center cursor-pointer"
                      value={task.actStart}
                      onChange={(e) => updateTask(task.id, 'actStart', e.target.value)}
                    />
                  </div>
                  <div style={{ width: COL_WIDTHS.date }} className="flex items-center px-1 h-full">
                    <input 
                      type="date"
                      className="w-full bg-transparent px-1 outline-none text-[11px] text-slate-600 font-medium text-center cursor-pointer"
                      value={task.actEnd}
                      onChange={(e) => updateTask(task.id, 'actEnd', e.target.value)}
                    />
                  </div>
                  <div style={{ width: COL_WIDTHS.dur }} className="flex items-center justify-center text-[11px] font-medium text-slate-600 h-full">
                    {calcDays(task.actStart, task.actEnd)}d
                  </div>

                  {/* VARIANCE */}
                  <div style={{ width: COL_WIDTHS.var }} className="flex items-center justify-center border-l border-slate-100 h-full">
                    {(() => {
                      const v = calcVariance(task.fcstEnd, task.actEnd);
                      if (v === "-") return <span className="text-slate-400 font-bold">-</span>;
                      const num = Number(v);
                      return (
                        <span className={cn(
                          "font-bold text-[11px]",
                          num > 0 ? "text-red-500" : num < 0 ? "text-emerald-500" : "text-slate-400"
                        )}>
                          {num > 0 ? `+${num}d` : `${num}d`}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                );
              })}
              
              {/* Add row stub */}
            </div>
          </div>

          {/* RIGHT PANE: GANTT CHART */}
          <div className="flex-1 relative flex flex-col bg-slate-50 min-w-[400px]">
            
            {/* Timeline Header */}
            <div className="sticky top-0 z-20 h-10 flex border-b border-slate-200 bg-slate-50 shrink-0 select-none items-center text-[10px] font-bold text-slate-400 uppercase">
              <div className="flex w-full h-full items-end relative overflow-hidden">
                {daysItems.map((day, i) => {
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  return (
                    <div 
                      key={i} 
                      style={{ width: dayWidth }} 
                      className={cn(
                        "shrink-0 flex flex-col items-center justify-end h-full pt-1 pb-1 border-r border-slate-100 text-[10px]",
                        isWeekend ? "bg-slate-100/50 text-slate-400" : "text-slate-400"
                      )}
                    >
                      <span className="opacity-60 leading-tight">{format(day, 'eeeee')}</span>
                      <span className="leading-tight">{format(day, 'd')}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline Body (Background Grid + Bars) */}
            <div className="flex flex-col relative" style={{ width: timelineWidth }}>
              
              <div className="absolute inset-0 gantt-grid pointer-events-none z-0"></div>

              {/* Rows matching table */}
              {renderItems.map((item, idx) => {
                if (item.type === 'header') {
                  return <div key={`gheader-${item.group}-${idx}`} className="h-10 border-b border-slate-200 bg-slate-100/50 shrink-0" />;
                }
                if (item.type === 'add-stub') {
                  return <div key={`gadd-${item.group}-${idx}`} className="h-10 border-b border-slate-100 shrink-0" />;
                }

                const task = item.task;
                let fcstLeft = 0, fcstWidth = 0;
                let actLeft = 0, actWidth = 0;

                if (task.fcstStart && task.fcstEnd && isValid(parseISO(task.fcstStart)) && isValid(parseISO(task.fcstEnd))) {
                  const start = parseISO(task.fcstStart);
                  const end = parseISO(task.fcstEnd);
                  if (start <= end) {
                    fcstLeft = differenceInDays(start, timelineStart) * dayWidth;
                    fcstWidth = (differenceInDays(end, start) + 1) * dayWidth;
                  }
                }

                if (task.actStart && task.actEnd && isValid(parseISO(task.actStart)) && isValid(parseISO(task.actEnd))) {
                  const start = parseISO(task.actStart);
                  const end = parseISO(task.actEnd);
                  if (start <= end) {
                    actLeft = differenceInDays(start, timelineStart) * dayWidth;
                    actWidth = (differenceInDays(end, start) + 1) * dayWidth;
                  }
                }

                return (
                  <div key={task.id} className="h-12 shrink-0 border-b border-slate-100 relative group z-10 flex items-center">
                    <div className="absolute inset-0 hidden group-hover:block bg-slate-50/50 z-[-1]" />
                    <div className="w-full h-8 relative z-10">
                      {/* Forecast Bar (Top line - Hollow) */}
                      {fcstWidth > 0 && (
                        <div 
                          className="absolute top-0 h-[10px] rounded border-2 border-violet-300 transition-all bg-white shadow-sm hover:-translate-y-[1px]"
                          style={{ left: fcstLeft, width: fcstWidth }}
                          title={`FCST: ${task.fcstStart} to ${task.fcstEnd}`}
                        >
                        </div>
                      )}
                      
                      {/* Actual Bar (Bottom line - Solid) */}
                      {actWidth > 0 && (
                        <div 
                          className="absolute bottom-0 h-[12px] rounded bg-violet-400 shadow-sm transition-all hover:translate-y-[1px]"
                          style={{ left: actLeft, width: actWidth }}
                          title={`ACT: ${task.actStart} to ${task.actEnd}`}
                        >
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Add global missing rows if any? No longer needed since we handle add-stubs per group. */}
            </div>

          </div>
            </div>
          </div>
        </div>
        <footer className="h-12 bg-white border-t border-slate-200 flex items-center px-8 justify-between text-xs text-slate-500 shrink-0">
          <div className="flex gap-4">
            <span>Total Tasks: {filteredTasks.length}</span>
            <span>Completed: {filteredTasks.filter(t => t.actEnd).length}</span>
          </div>
          <div className="flex gap-4 items-center">
            <span>Legend:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1.5 border-2 border-violet-300 bg-white rounded"></div>
              <span>Forecast</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1.5 bg-violet-400 rounded"></div>
              <span>Actual</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

