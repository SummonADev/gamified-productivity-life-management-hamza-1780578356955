import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { v4 as uuidv4 } from 'uuid';
import type { Project, Milestone } from '@/types';
import { Trash2, CheckCircle, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { progressPercent } from '@/lib/helpers';

const PROJECT_COLORS = ['#A8C5A0', '#C5B3D9', '#F5D78E', '#E8A0A0', '#A0C4E8'];

const ProjectsPage: React.FC = () => {
  const { state, dispatch } = useGame();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [color, setColor] = useState<string>(PROJECT_COLORS[0]);
  const [milestoneInput, setMilestoneInput] = useState<string>('');
  const [milestones, setMilestones] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleAddMilestone = () => {
    if (!milestoneInput.trim()) return;
    setMilestones([...milestones, milestoneInput.trim()]);
    setMilestoneInput('');
  };

  const handleAdd = () => {
    if (!title.trim()) return;
    const project: Project = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      color,
      createdAt: new Date().toISOString(),
      milestones: milestones.map((m) => ({ id: uuidv4(), title: m, completed: false })),
    };
    dispatch({ type: 'ADD_PROJECT', payload: project });
    setTitle('');
    setDescription('');
    setMilestones([]);
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-cocoa">📁 Projects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-sage hover:bg-sage-dark text-cocoa px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {showForm && (
        <div className="bg-cloud rounded-xl p-4 space-y-3">
          <input
            className="w-full bg-white rounded-lg px-3 py-2 text-cocoa border border-mist focus:outline-none focus:border-sage"
            placeholder="Project title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full bg-white rounded-lg px-3 py-2 text-cocoa border border-mist focus:outline-none focus:border-sage"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2">
            {PROJECT_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? 'border-cocoa scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-white rounded-lg px-3 py-2 text-cocoa border border-mist focus:outline-none focus:border-sage"
              placeholder="Add milestone..."
              value={milestoneInput}
              onChange={(e) => setMilestoneInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMilestone()}
            />
            <button onClick={handleAddMilestone} className="bg-mist hover:bg-lavender/50 px-3 py-2 rounded-lg text-cocoa">
              <Plus size={18} />
            </button>
          </div>
          {milestones.length > 0 && (
            <ul className="space-y-1">
              {milestones.map((m, i) => (
                <li key={i} className="text-sm text-bark flex items-center gap-2">
                  <span>📌</span> {m}
                  <button onClick={() => setMilestones(milestones.filter((_, j) => j !== i))} className="text-rose text-xs">✕</button>
                </li>
              ))}
            </ul>
          )}
          <button onClick={handleAdd} className="bg-sage hover:bg-sage-dark text-cocoa px-4 py-2 rounded-lg font-medium transition-colors">
            Create Project
          </button>
        </div>
      )}

      <div className="space-y-4">
        {state.projects.length === 0 && (
          <p className="text-bark text-center py-8">No projects yet. Start an epic quest! 🗺️</p>
        )}
        {state.projects.map((project) => {
          const completedMs = project.milestones.filter((m) => m.completed).length;
          const totalMs = project.milestones.length;
          const pct = progressPercent(completedMs, totalMs);
          const isExpanded = expanded === project.id;
          return (
            <div key={project.id} className="bg-cloud rounded-xl overflow-hidden">
              <div
                className="p-4 cursor-pointer flex items-center gap-3"
                onClick={() => setExpanded(isExpanded ? null : project.id)}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                <div className="flex-1">
                  <h3 className="font-bold text-cocoa">{project.title}</h3>
                  <p className="text-xs text-bark">{completedMs}/{totalMs} milestones · {pct}%</p>
                  <div className="mt-1 w-full bg-mist rounded-full h-2">
                    <div className="bg-sage h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={18} className="text-bark" /> : <ChevronDown size={18} className="text-bark" />}
                <button
                  onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DELETE_PROJECT', payload: project.id }); }}
                  className="text-rose hover:text-rose-dark"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {project.description && <p className="text-sm text-bark">{project.description}</p>}
                  {project.milestones.map((ms) => (
                    <div key={ms.id} className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch({ type: 'COMPLETE_MILESTONE', payload: { projectId: project.id, milestoneId: ms.id } })}
                        className={`${ms.completed ? 'text-sage' : 'text-mist hover:text-sage'}`}
                      >
                        <CheckCircle size={18} />
                      </button>
                      <span className={`text-sm ${ms.completed ? 'line-through text-bark' : 'text-cocoa'}`}>{ms.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsPage;
