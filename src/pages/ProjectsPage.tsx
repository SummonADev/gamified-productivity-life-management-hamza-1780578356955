import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { v4 as uuidv4 } from 'uuid';
import type { Project, Milestone } from '@/types';
import { progressPercent } from '@/lib/helpers';
import { Trash2, Plus, CheckCircle } from 'lucide-react';

const PROJECT_COLORS = ['#B2D3C2', '#C5B4E3', '#F4A4B8', '#A8D8EA', '#F5D78E'];

const ProjectsPage: React.FC = () => {
  const { state, dispatch } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [milestoneInputs, setMilestoneInputs] = useState<string[]>(['']);

  const handleAdd = () => {
    if (!title.trim()) return;
    const milestones: Milestone[] = milestoneInputs
      .filter((m) => m.trim())
      .map((m) => ({ id: uuidv4(), title: m.trim(), completed: false }));
    const project: Project = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      milestones,
      createdAt: new Date().toISOString(),
      color,
    };
    dispatch({ type: 'ADD_PROJECT', payload: project });
    setTitle('');
    setDescription('');
    setMilestoneInputs(['']);
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
            placeholder="Description (optional)"
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
          <div className="space-y-2">
            <p className="text-sm font-medium text-cocoa">Milestones</p>
            {milestoneInputs.map((m, i) => (
              <input
                key={i}
                className="w-full bg-white rounded-lg px-3 py-2 text-cocoa border border-mist focus:outline-none focus:border-sage text-sm"
                placeholder={`Milestone ${i + 1}...`}
                value={m}
                onChange={(e) => {
                  const updated = [...milestoneInputs];
                  updated[i] = e.target.value;
                  setMilestoneInputs(updated);
                }}
              />
            ))}
            <button
              onClick={() => setMilestoneInputs([...milestoneInputs, ''])}
              className="text-sm text-sage-dark hover:underline"
            >
              + Add milestone
            </button>
          </div>
          <button onClick={handleAdd} className="bg-sage hover:bg-sage-dark text-cocoa px-4 py-2 rounded-lg font-medium transition-colors">
            Create Project
          </button>
        </div>
      )}

      <div className="space-y-4">
        {state.projects.length === 0 && <p className="text-bark text-center py-8">No projects yet. Start a big adventure! 🏔️</p>}
        {state.projects.map((project) => {
          const done = project.milestones.filter((m) => m.completed).length;
          const total = project.milestones.length;
          const pct = progressPercent(done, total);
          return (
            <div key={project.id} className="bg-cloud rounded-xl p-4" style={{ borderLeft: `4px solid ${project.color}` }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-cocoa text-lg">{project.title}</h3>
                  {project.description && <p className="text-sm text-bark">{project.description}</p>}
                </div>
                <button
                  onClick={() => dispatch({ type: 'DELETE_PROJECT', payload: project.id })}
                  className="text-rose hover:text-rose-dark"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              {total > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-bark mb-1">
                    <span>{done}/{total} milestones</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full bg-mist rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: project.color }} />
                  </div>
                  <div className="mt-2 space-y-1">
                    {project.milestones.map((ms) => (
                      <button
                        key={ms.id}
                        onClick={() => dispatch({ type: 'COMPLETE_MILESTONE', payload: { projectId: project.id, milestoneId: ms.id } })}
                        className={`flex items-center gap-2 text-sm w-full text-left px-2 py-1 rounded hover:bg-mist ${ms.completed ? 'line-through text-bark' : 'text-cocoa'}`}
                      >
                        <CheckCircle size={16} className={ms.completed ? 'text-sage' : 'text-mist'} />
                        {ms.title}
                      </button>
                    ))}
                  </div>
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
