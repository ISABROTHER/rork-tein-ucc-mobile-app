import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useMemo, useState } from "react";

export type MemberRole = "member" | "verified" | "volunteer" | "executive" | "alumni";

export interface MemberProfile {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  hall: string;
  faculty: string;
  department: string;
  level: string;
  program: string;
  role: MemberRole;
  verified: boolean;
  points: number;
  volunteerHours: number;
  badges: string[];
  membershipId: string;
  duesStatus: "paid" | "pending";
  membershipHistory: string[];
}

export interface FeedItem {
  id: string;
  category: "announcement" | "news" | "policy" | "event";
  title: string;
  summary: string;
  timestamp: string;
  facultyTags: string[];
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  banner: string;
  description: string;
  tags: string[];
  rsvpStatus: "none" | "going" | "interested";
  attendanceCode: string;
  recapPhotos: string[];
}

export interface IssueTicket {
  id: string;
  category: "academic" | "fees" | "accommodation" | "welfare" | "security";
  title: string;
  details: string;
  anonymous: boolean;
  status: "Received" | "In Progress" | "Escalated" | "Resolved";
  createdAt: string;
  updates: string[];
}

export interface VolunteerTask {
  id: string;
  group: "Outreach" | "Media" | "Research" | "Welfare";
  title: string;
  dueDate: string;
  hours: number;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

export interface MediaItem {
  id: string;
  type: "photo" | "video" | "audio" | "poster";
  title: string;
  description: string;
  url: string;
  thumbnail: string;
}

export interface OpportunityItem {
  id: string;
  type: "internship" | "scholarship" | "job" | "announcement";
  organization: string;
  title: string;
  deadline: string;
  highlights: string[];
}

export interface PaymentRecord {
  id: string;
  label: string;
  amount: string;
  date: string;
  method: string;
  status: "success" | "pending";
}

interface AppState {
  profile: MemberProfile;
  feed: FeedItem[];
  events: EventItem[];
  issues: IssueTicket[];
  tasks: VolunteerTask[];
  media: MediaItem[];
  opportunities: OpportunityItem[];
  payments: PaymentRecord[];
  todayQrSeed: string;
  learningProgress: number;
  leaderboard: { name: string; hours: number; hall: string }[];
  analytics: {
    attendance: { total: number; returning: number; newcomers: number };
    facultyBreakdown: { faculty: string; percent: number }[];
    taskCompletion: number;
  };
  updateRsvp: (eventId: string, status: EventItem["rsvpStatus"]) => void;
  submitIssue: (input: Pick<IssueTicket, "category" | "title" | "details"> & { anonymous?: boolean }) => void;
  toggleTask: (taskId: string) => void;
  markPaymentSuccess: (paymentId: string) => void;
}

const storageKey = "tein-app-cache";

const initialProfile: MemberProfile = {
  id: "member-001",
  firstName: "Adjoa",
  lastName: "Mensah",
  gender: "Female",
  hall: "Oguaa Hall",
  faculty: "Humanities",
  department: "Political Science",
  level: "400",
  program: "Political Science with History",
  role: "verified",
  verified: true,
  points: 870,
  volunteerHours: 56,
  badges: ["Mobilizer", "Policy Pro", "Attendance Elite"],
  membershipId: "TEIN-UCC-2025-045",
  duesStatus: "paid",
  membershipHistory: ["Enrolled 2021", "Verified 2022", "Volunteer Lead 2024"],
};

const initialFeed: FeedItem[] = [
  {
    id: "feed-1",
    category: "announcement",
    title: "Campus Dialogue with Youth Wing Leaders",
    summary: "Meet Hon. Sammy Gyamfi this Friday at the ceremonial grounds. Seats limited.",
    timestamp: "2h ago",
    facultyTags: ["Humanities", "Education"],
  },
  {
    id: "feed-2",
    category: "policy",
    title: "What the 24-hour Economy Means for Students",
    summary: "Digestible explainer with infographics and actionable talking points",
    timestamp: "5h ago",
    facultyTags: ["Business", "Science"],
  },
  {
    id: "feed-3",
    category: "event",
    title: "Volunteer Sprint for Komenda Outreach",
    summary: "Logistics, transport and media coverage teams needed",
    timestamp: "Yesterday",
    facultyTags: ["Humanities", "Law", "Education"],
  },
];

const initialEvents: EventItem[] = [
  {
    id: "event-1",
    title: "TEIN Policy Night",
    date: "Sat, Feb 15",
    time: "6:00 PM",
    venue: "Amissah-Arthur Hall",
    banner: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    description: "Immersive policy education with breakout rooms per faculty. Limited seats.",
    tags: ["Policy", "Education"],
    rsvpStatus: "going",
    attendanceCode: "TPN6543",
    recapPhotos: [
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    ],
  },
  {
    id: "event-2",
    title: "Volunteer Deployment - Komenda Block",
    date: "Tue, Feb 25",
    time: "8:30 AM",
    venue: "SRC Park",
    banner: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef",
    description: "Door-to-door canvassing, welfare checks and listening posts.",
    tags: ["Volunteer", "Field"],
    rsvpStatus: "interested",
    attendanceCode: "VOL8891",
    recapPhotos: [],
  },
  {
    id: "event-3",
    title: "Media Lab: Storytelling for TEIN",
    date: "Thu, Mar 6",
    time: "4:00 PM",
    venue: "TEIN Studio",
    banner: "https://images.unsplash.com/photo-1503424886307-b090341d25d1",
    description: "Hands-on audio + video sprint for rapid content production.",
    tags: ["Media", "Training"],
    rsvpStatus: "none",
    attendanceCode: "MED4410",
    recapPhotos: [],
  },
];

const initialIssues: IssueTicket[] = [
  {
    id: "issue-1",
    category: "accommodation",
    title: "Leaking roof at Oguaa Annex",
    details: "Block B third floor leaks when it rains, affects 12 rooms.",
    anonymous: false,
    status: "In Progress",
    createdAt: "Jan 18",
    updates: ["Welfare desk assigned team", "Facility management notified"],
  },
  {
    id: "issue-2",
    category: "academic",
    title: "Missing grade for POLS 402",
    details: "Entire tutorial group has no grade on portal.",
    anonymous: true,
    status: "Escalated",
    createdAt: "Jan 06",
    updates: ["Faculty rep compiling list", "Dean engagement scheduled"],
  },
];

const initialTasks: VolunteerTask[] = [
  {
    id: "task-1",
    group: "Outreach",
    title: "Komenda Voter Mapping",
    dueDate: "Feb 20",
    hours: 6,
    completed: false,
    priority: "high",
  },
  {
    id: "task-2",
    group: "Media",
    title: "Micro-podcast on Free SHS",
    dueDate: "Feb 16",
    hours: 3,
    completed: true,
    priority: "medium",
  },
  {
    id: "task-3",
    group: "Research",
    title: "Campus cost-of-living survey",
    dueDate: "Feb 28",
    hours: 5,
    completed: false,
    priority: "high",
  },
];

const initialMedia: MediaItem[] = [
  {
    id: "media-1",
    type: "video",
    title: "TEIN 101 in 60 seconds",
    description: "Animated primer for freshers",
    url: "https://images.unsplash.com/photo-1470723710355-95304d8aece4",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
  },
  {
    id: "media-2",
    type: "poster",
    title: "Volunteer Sprint Poster",
    description: "Share-ready asset",
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
  },
  {
    id: "media-3",
    type: "audio",
    title: "Voice note from Organizer",
    description: "2-min mobilization brief",
    url: "https://images.unsplash.com/photo-1484704849700-f032a568e944",
    thumbnail: "https://images.unsplash.com/photo-1484704849700-f032a568e944",
  },
];

const initialOpportunities: OpportunityItem[] = [
  {
    id: "opp-1",
    type: "internship",
    organization: "Ministry of Finance",
    title: "Budget Analytics Internship",
    deadline: "Mar 4",
    highlights: ["Paid", "Preference for level 300/400"],
  },
  {
    id: "opp-2",
    type: "scholarship",
    organization: "NDC Youth Wing",
    title: "Policy Research Fellowship",
    deadline: "Feb 22",
    highlights: ["1-year", "Mentorship"],
  },
  {
    id: "opp-3",
    type: "announcement",
    organization: "Campus Jobs",
    title: "Voter Education Fellows",
    deadline: "Rolling",
    highlights: ["Stipend", "Flexible hours"],
  },
];

const initialPayments: PaymentRecord[] = [
  {
    id: "pay-1",
    label: "2025 Semester Dues",
    amount: "GH₵40",
    date: "Jan 04",
    method: "MTN MoMo",
    status: "success",
  },
  {
    id: "pay-2",
    label: "Solidarity Fund Donation",
    amount: "GH₵20",
    date: "Dec 15",
    method: "Card",
    status: "success",
  },
];

const leaderboardSnapshot = [
  { name: "Kwesi A.", hours: 82, hall: "Valco" },
  { name: "Adjoa M.", hours: 56, hall: "Oguaa" },
  { name: "Zainab K.", hours: 49, hall: "Adehye" },
];

export const [AppStateProvider, useAppState] = createContextHook<AppState>(() => {
  const [profile, setProfile] = useState<MemberProfile>(initialProfile);
  const [feed, setFeed] = useState<FeedItem[]>(initialFeed);
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [issues, setIssues] = useState<IssueTicket[]>(initialIssues);
  const [tasks, setTasks] = useState<VolunteerTask[]>(initialTasks);
  const [media] = useState<MediaItem[]>(initialMedia);
  const [opportunities] = useState<OpportunityItem[]>(initialOpportunities);
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
  const [learningProgress, setLearningProgress] = useState<number>(72);

  useEffect(() => {
    const loadCache = async () => {
      try {
        const cached = await AsyncStorage.getItem(storageKey);
        if (!cached) {
          return;
        }
        const parsed = JSON.parse(cached) as Partial<AppState>;
        if (parsed.profile) {
          setProfile(parsed.profile);
        }
        if (parsed.feed) {
          setFeed(parsed.feed);
        }
        if (parsed.events) {
          setEvents(parsed.events as EventItem[]);
        }
        if (parsed.issues) {
          setIssues(parsed.issues as IssueTicket[]);
        }
        if (parsed.tasks) {
          setTasks(parsed.tasks as VolunteerTask[]);
        }
        if (typeof parsed.learningProgress === "number") {
          setLearningProgress(parsed.learningProgress);
        }
        if (parsed.payments) {
          setPayments(parsed.payments as PaymentRecord[]);
        }
      } catch (error) {
        console.log("Cache load failed", error);
      }
    };

    loadCache();
  }, []);

  useEffect(() => {
    const persist = async () => {
      try {
        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify({ profile, feed, events, issues, tasks, payments, learningProgress }),
        );
      } catch (error) {
        console.log("Cache save failed", error);
      }
    };

    persist();
  }, [profile, feed, events, issues, tasks, payments, learningProgress]);

  const todayQrSeed = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return `${profile.membershipId}-${today}-${profile.points}`;
  }, [profile.membershipId, profile.points]);

  const updateRsvp = useCallback(
    (eventId: string, status: EventItem["rsvpStatus"]) => {
      setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, rsvpStatus: status } : event)));
    },
    [],
  );

  const submitIssue = useCallback(
    (input: Pick<IssueTicket, "category" | "title" | "details"> & { anonymous?: boolean }) => {
      const newIssue: IssueTicket = {
        id: `issue-${Date.now()}`,
        category: input.category,
        title: input.title,
        details: input.details,
        anonymous: input.anonymous ?? false,
        status: "Received",
        createdAt: new Date().toDateString(),
        updates: ["Team acknowledged"],
      };
      setIssues((prev) => [newIssue, ...prev]);
      setProfile((prev) => ({ ...prev, points: prev.points + 10 }));
    },
    [],
  );

  const toggleTask = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) {
          return task;
        }
        const completed = !task.completed;
        return { ...task, completed };
      }),
    );

    setProfile((prev) => ({ ...prev, volunteerHours: prev.volunteerHours + 2 }));
  }, []);

  const markPaymentSuccess = useCallback((paymentId: string) => {
    setPayments((prev) => prev.map((payment) => (payment.id === paymentId ? { ...payment, status: "success" } : payment)));
    setProfile((prev) => ({ ...prev, duesStatus: "paid" }));
  }, []);

  const analytics = useMemo(
    () => ({
      attendance: { total: 612, returning: 441, newcomers: 171 },
      facultyBreakdown: [
        { faculty: "Humanities", percent: 32 },
        { faculty: "Business", percent: 21 },
        { faculty: "Science", percent: 19 },
        { faculty: "Education", percent: 17 },
        { faculty: "Law", percent: 11 },
      ],
      taskCompletion: Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100),
    }),
    [tasks],
  );

  const value = useMemo(
    () => ({
      profile,
      feed,
      events,
      issues,
      tasks,
      media,
      opportunities,
      payments,
      todayQrSeed,
      learningProgress,
      leaderboard: leaderboardSnapshot,
      analytics,
      updateRsvp,
      submitIssue,
      toggleTask,
      markPaymentSuccess,
    }),
    [
      analytics,
      events,
      feed,
      issues,
      learningProgress,
      markPaymentSuccess,
      media,
      opportunities,
      payments,
      profile,
      submitIssue,
      tasks,
      todayQrSeed,
      toggleTask,
      updateRsvp,
    ],
  );

  return value;
});

export function useRoleColor(role: MemberRole) {
  return useMemo(() => {
    switch (role) {
      case "member":
        return "#D31532";
      case "verified":
        return "#008CFF";
      case "volunteer":
        return "#1F8E5C";
      case "executive":
        return "#FFB703";
      case "alumni":
        return "#2F6FED";
      default:
        return "#6B7085";
    }
  }, [role]);
}
