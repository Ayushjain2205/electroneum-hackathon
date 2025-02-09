import { type Schedule, type TaskList } from "@/lib/manager-templates";

interface ManagerCardProps {
  data: Schedule | TaskList;
  type: "schedule" | "tasks";
}

export function ManagerCard({ data, type }: ManagerCardProps) {
  if (type === "schedule") {
    const schedule = data as Schedule;
    const formatTime = (time: string) => {
      try {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });
      } catch (e) {
        return time; // Return original if parsing fails
      }
    };

    const getEmoji = (type: "meeting" | "focus" | "break" | "admin") => {
      switch (type) {
        case "meeting":
          return "👥";
        case "focus":
          return "🎯";
        case "break":
          return "☕";
        case "admin":
          return "📋";
        default:
          return "��";
      }
    };

    return (
      <div className="space-y-4 max-w-sm">
        <div className="text-center font-bold text-xl border-b-2 border-black pb-2">
          📅 {(schedule.type || "DAILY").toUpperCase()} SCHEDULE
          <div className="text-sm font-normal text-gray-600">
            {schedule.date || new Date().toISOString().split("T")[0]}
          </div>
        </div>

        <div className="space-y-3">
          {(schedule.blocks || []).map((block, index) => (
            <div key={index} className="border-l-4 border-gray-200 pl-3">
              <div className="flex items-center gap-2">
                <span>{getEmoji(block.type)}</span>
                <span className="font-medium">
                  {formatTime(block.startTime)} - {formatTime(block.endTime)}
                </span>
              </div>
              <div className="ml-6">
                <div className="font-medium">{block.activity}</div>
                {block.participants && block.participants.length > 0 && (
                  <div className="text-sm text-gray-600">
                    With: {block.participants.join(", ")}
                  </div>
                )}
                {block.notes && (
                  <div className="text-sm text-gray-600">
                    Note: {block.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t-2 border-black">
          <div className="text-sm font-medium mb-2">Time Distribution</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Focus Time</span>
              <span className="font-medium">
                {schedule.focusTime || 0}h (
                {Math.round(
                  ((schedule.focusTime || 0) / (schedule.totalHours || 1)) * 100
                )}
                %)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Meeting Time</span>
              <span className="font-medium">
                {schedule.meetingTime || 0}h (
                {Math.round(
                  ((schedule.meetingTime || 0) / (schedule.totalHours || 1)) *
                    100
                )}
                %)
              </span>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600 pt-2 border-t-2 border-black">
          💡 Remember to take breaks and stay flexible for urgent matters
        </div>
      </div>
    );
  }

  const taskList = data as TaskList;
  const getPriorityEmoji = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
    }
  };

  const getStatusEmoji = (
    status: "todo" | "in-progress" | "blocked" | "completed"
  ) => {
    switch (status) {
      case "todo":
        return "📝";
      case "in-progress":
        return "⏳";
      case "blocked":
        return "🚫";
      case "completed":
        return "✅";
    }
  };

  return (
    <div className="space-y-4 max-w-sm">
      <div className="text-center font-bold text-xl border-b-2 border-black pb-2">
        📋 TASK LIST
        <div className="text-sm font-normal text-gray-600">{taskList.date}</div>
      </div>

      <div className="space-y-3">
        {taskList.tasks.map((task, index) => (
          <div key={index} className="border-l-4 border-gray-200 pl-3">
            <div className="flex items-center gap-2">
              <span>{getPriorityEmoji(task.priority)}</span>
              <span>{getStatusEmoji(task.status)}</span>
              <span className="font-medium">{task.title}</span>
            </div>
            <div className="ml-6">
              <div className="text-sm">{task.description}</div>
              {task.dueDate && (
                <div className="text-sm text-gray-600">Due: {task.dueDate}</div>
              )}
              {task.assignee && (
                <div className="text-sm text-gray-600">
                  Assignee: {task.assignee}
                </div>
              )}
              {task.notes && (
                <div className="text-sm text-gray-600">Note: {task.notes}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t-2 border-black">
        <div className="text-sm font-medium mb-2">Progress Overview</div>
        <div className="w-full h-4 bg-gray-100 rounded-full border border-black overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
            style={{
              width: `${Math.round(
                (taskList.completedTasks / taskList.totalTasks) * 100
              )}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span>{taskList.completedTasks} completed</span>
          <span>{taskList.totalTasks} total</span>
        </div>
      </div>

      <div className="pt-2 border-t-2 border-black">
        <div className="text-sm font-medium mb-2">Priority Breakdown</div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <div>🔴 High</div>
            <div className="font-medium">{taskList.priority.high}</div>
          </div>
          <div>
            <div>🟡 Medium</div>
            <div className="font-medium">{taskList.priority.medium}</div>
          </div>
          <div>
            <div>🟢 Low</div>
            <div className="font-medium">{taskList.priority.low}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
