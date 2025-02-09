export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "in-progress" | "blocked" | "completed";
export type ScheduleType = "daily" | "weekly" | "project";

export interface Task {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  assignee?: string;
  notes?: string;
}

export interface TimeBlock {
  startTime: string;
  endTime: string;
  activity: string;
  type: "meeting" | "focus" | "break" | "admin";
  participants?: string[];
  notes?: string;
}

export interface Schedule {
  type: ScheduleType;
  blocks: TimeBlock[];
  date: string;
  totalHours: number;
  focusTime: number;
  meetingTime: number;
}

export interface TaskList {
  date: string;
  tasks: Task[];
  completedTasks: number;
  totalTasks: number;
  priority: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface ManagerDisplay {
  type: "schedule" | "tasks";
  data: Schedule | TaskList;
}

export const managerQuestions = {
  initial:
    "I'll help you organize your work! What would you like to do? (create schedule, manage tasks, or discuss deliverables)",
  scheduleType:
    "What type of schedule would you like to create? (daily, weekly, or project)",
  taskPriority: "How would you prioritize this task? (high, medium, or low)",
  timePreference: "What time would you like to start your day?",
  workStyle: "Do you prefer focused work in the morning or afternoon?",
};

export function formatScheduleMessage(schedule: Schedule): string {
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getEmoji = (type: TimeBlock["type"]) => {
    switch (type) {
      case "meeting":
        return "👥";
      case "focus":
        return "🎯";
      case "break":
        return "☕";
      case "admin":
        return "📋";
    }
  };

  return `📅 ${schedule.type.toUpperCase()} SCHEDULE for ${schedule.date}

⏰ Schedule Overview:
${schedule.blocks
  .map(
    (block) => `
${getEmoji(block.type)} ${formatTime(block.startTime)} - ${formatTime(
      block.endTime
    )}
   ${block.activity}
   ${block.participants ? `   • With: ${block.participants.join(", ")}` : ""}
   ${block.notes ? `   • Note: ${block.notes}` : ""}`
  )
  .join("\n")}

📊 Time Distribution:
• Total Hours: ${schedule.totalHours}h
• Focus Time: ${schedule.focusTime}h (${Math.round(
    (schedule.focusTime / schedule.totalHours) * 100
  )}%)
• Meeting Time: ${schedule.meetingTime}h (${Math.round(
    (schedule.meetingTime / schedule.totalHours) * 100
  )}%)

💡 Tips:
• Take regular breaks
• Block time for deep work
• Buffer time between meetings
• Stay flexible for urgent matters

Need any adjustments to this schedule? Let me know! 📋`;
}

export function formatTaskListMessage(taskList: TaskList): string {
  const getPriorityEmoji = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
    }
  };

  const getStatusEmoji = (status: TaskStatus) => {
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

  return `📋 TASK LIST for ${taskList.date}

${taskList.tasks
  .map(
    (task) => `
${getPriorityEmoji(task.priority)} ${getStatusEmoji(task.status)} ${task.title}
   • ${task.description}
   ${task.dueDate ? `   • Due: ${task.dueDate}` : ""}
   ${task.assignee ? `   • Assignee: ${task.assignee}` : ""}
   ${task.notes ? `   • Note: ${task.notes}` : ""}`
  )
  .join("\n")}

📊 Progress Overview:
• Completed: ${taskList.completedTasks}/${taskList.totalTasks} (${Math.round(
    (taskList.completedTasks / taskList.totalTasks) * 100
  )}%)
• Priority Breakdown:
  - High: ${taskList.priority.high}
  - Medium: ${taskList.priority.medium}
  - Low: ${taskList.priority.low}

💡 Tips:
• Focus on high-priority items first
• Update task status regularly
• Delegate when possible
• Break down large tasks

Need to adjust any tasks or create new ones? Just let me know! 📋`;
}

export function isScheduleRequest(text: string): boolean {
  const scheduleKeywords = [
    "schedule",
    "calendar",
    "agenda",
    "plan",
    "timetable",
    "meetings",
    "today",
    "tomorrow",
    "week",
    "my day",
  ];
  const actionWords = [
    "create",
    "make",
    "plan",
    "organize",
    "set up",
    "arrange",
    "show",
    "what",
    "tell",
    "check",
    "view",
    "see",
    "get",
    "whats",
    "what's",
  ];

  const lowercaseText = text.toLowerCase();

  // Direct schedule queries
  if (
    lowercaseText.includes("my schedule") ||
    lowercaseText.includes("what do i have") ||
    lowercaseText.includes("what's on") ||
    lowercaseText.includes("whats on")
  ) {
    return true;
  }

  return (
    scheduleKeywords.some((keyword) => lowercaseText.includes(keyword)) &&
    actionWords.some((word) => lowercaseText.includes(word))
  );
}

export function isTaskRequest(text: string): boolean {
  const taskKeywords = [
    "task",
    "todo",
    "to-do",
    "tasks",
    "list",
    "action items",
    "deliverable",
  ];
  const actionWords = ["create", "manage", "track", "list", "show", "organize"];

  const lowercaseText = text.toLowerCase();
  return (
    taskKeywords.some((keyword) => lowercaseText.includes(keyword)) &&
    actionWords.some((word) => lowercaseText.includes(word))
  );
}
