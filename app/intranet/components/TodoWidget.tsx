import React from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from '@/data/intranetDashboardData';
import { getRemainingDays, formatDate } from '@/lib/intranetUtils';

interface TodoWidgetProps {
    tasks: Task[];
    onToggleTask: (taskId: string) => void;
    onOpenTaskDialog: (task?: Task | null) => void; // 선택적 task 파라미터
}

export const TodoWidget: React.FC<TodoWidgetProps> = ({ tasks, onToggleTask, onOpenTaskDialog }) => {
    const incompleteTasksCount = tasks.filter(t => !t.completed).length;

    return (
        <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-semibold text-white flex items-center">
                    <CheckSquare className="h-5 w-5 mr-2 text-purple-400" />
                    <span>할 일</span>
                    <span className="ml-2 text-xs px-1.5 py-0.5 bg-black/50 text-white rounded-full border border-white/10">
                        {incompleteTasksCount}개 남음
                    </span>
                </h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-white/10" onClick={() => onOpenTaskDialog(null)}>
                    <Plus className="h-5 w-5" />
                </Button>
            </div>
            <div className="p-4">
                <div className="space-y-2">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`flex items-start p-2 rounded-lg border ${task.completed
                                ? 'border-white/5 bg-white/5 opacity-60'
                                : 'border-white/10 hover:bg-white/5'
                                } transition-colors group cursor-pointer`} // cursor-pointer 추가하여 클릭 가능 암시
                            onClick={() => onOpenTaskDialog(task)} // 아이템 클릭 시 다이얼로그 열기
                        >
                            <div className="flex-shrink-0 mt-0.5">
                                <Checkbox
                                    checked={task.completed}
                                    onCheckedChange={(checkedState) => {
                                        // Checkbox의 onCheckedChange는 boolean 또는 'indeterminate'를 반환할 수 있음
                                        // 여기서는 boolean 상태만 처리한다고 가정
                                        if (typeof checkedState === 'boolean') {
                                            onToggleTask(task.id);
                                        }
                                    }}
                                    className={`${task.completed
                                        ? 'bg-green-600 border-green-600'
                                        : 'bg-black/50 border-white/30'
                                        }`}
                                    aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
                                />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className={`text-sm font-medium ${task.completed
                                    ? 'text-gray-400 line-through'
                                    : 'text-white group-hover:text-blue-200'
                                    } transition-colors`}>{task.title}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center">
                                        <div className="flex -space-x-1 mr-2">
                                            {task.assignees.map((assignee, index) => (
                                                <div
                                                    key={index}
                                                    className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-xs text-white bg-black/70 overflow-hidden"
                                                    title={assignee.name}
                                                >
                                                    {assignee.avatar ? (
                                                        <Image src={assignee.avatar} alt={assignee.name} width={20} height={20} />
                                                    ) : (
                                                        assignee.name.charAt(0)
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className={`rounded-full h-1.5 w-1.5 ${task.priority === 'high' ? 'bg-red-500' :
                                            task.priority === 'medium' ? 'bg-yellow-500' :
                                                'bg-green-500'
                                            }`}></div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs ${getRemainingDays(task.dueDate) < 0 && !task.completed // 기한 만료 조건 수정
                                            ? 'text-red-400'
                                            : getRemainingDays(task.dueDate) < 7 && !task.completed
                                                ? 'text-yellow-400'
                                                : task.completed ? 'text-green-400' : 'text-gray-400' // 완료 시 녹색, 그 외 기본 회색
                                            }`}>
                                            {task.completed
                                                ? '완료됨'
                                                : getRemainingDays(task.dueDate) < 0
                                                    ? '기한 만료'
                                                    : `${getRemainingDays(task.dueDate)}일 남음`
                                            }
                                        </span>
                                        <span className="text-xs text-gray-400 ml-1">({formatDate(task.dueDate).split(' ')[1]} {formatDate(task.dueDate).split(' ')[2]})</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center py-8">
                            <CheckSquare className="h-12 w-12 text-gray-600 mb-2" />
                            <p className="text-gray-400">할 일이 없습니다</p>
                            <p className="text-gray-500 text-xs mt-1">새로운 할 일을 추가해보세요</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 