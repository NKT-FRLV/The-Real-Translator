import React, { useEffect, useState } from "react";
import { MinimalUser, SessionDTO, SessionsResponse, ApiErrorResponse } from "@/shared/types/user";
import { Session as DBSession } from "@prisma/client";

interface AccountProps {
	user: MinimalUser;
}

const Account = ({ user }: AccountProps) => {
	const [currentSession, setCurrentSession] = useState<SessionDTO | null>(null);
	const [restSessions, setRestSessions] = useState<SessionDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
  
	useEffect(() => {
	  (async () => {
		try {
		  const res = await fetch("/api/sessions", { cache: "no-store" });
		  const data: SessionsResponse | ApiErrorResponse = await res.json();
  
		  if ("error" in data) setError(data.error);
		  else {
			setCurrentSession(data.currentSession);
			setRestSessions(data.restSessions);
		  }
		} catch {
		  setError("Failed to fetch sessions");
		} finally {
		  setLoading(false);
		}
	  })();
	}, []);
  
	const formatDate = (iso: string) => new Date(iso).toLocaleString("ru-RU");
  
	const handleTerminateSession = async (sessionId: string) => {
	  try {
		await fetch("/api/sessions", {
		  method: "DELETE",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ sessionId }),
		});
		setRestSessions((prev) => prev.filter((s) => s.id !== sessionId));
	  } catch {
		// optionally toast error
	  }
	};
  
	const handleTerminateAll = async () => {
	  try {
		await fetch("/api/sessions", {
		  method: "DELETE",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ all: true }),
		});
		setCurrentSession(null);
		setRestSessions([]);
	  } catch {}
	};

	return (
		<div className="flex flex-col space-y-4 sm:space-y-6">
			<h2 className="text-lg font-bold sm:text-xl md:text-2xl">
				Account Settings
			</h2>

			<div className="space-y-4 sm:space-y-6">
				<div className="bg-card rounded-lg p-3 border border-border shadow-sm sm:p-4">
					<h3 className="font-semibold mb-2 text-foreground text-sm sm:text-base sm:mb-3">
						Profile Information
					</h3>
					<div className="space-y-2 text-xs sm:text-sm">
						<div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
							<span className="text-muted-foreground font-medium min-w-0 sm:min-w-[60px]">
								Name:
							</span>
							<span className="text-foreground truncate">
								{user.name}
							</span>
						</div>
						<div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
							<span className="text-muted-foreground font-medium min-w-0 sm:min-w-[60px]">
								Email:
							</span>
							<span className="text-foreground truncate">
								{user.email}
							</span>
						</div>
						<div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
							<span className="text-muted-foreground font-medium min-w-0 sm:min-w-[60px]">
								Role:
							</span>
							<span className="text-foreground capitalize">
								{user.role}
							</span>
						</div>
					</div>
				</div>

				{/* Управление сессиями */}
				<div className="bg-card rounded-lg p-3 border border-border shadow-sm sm:p-4">
					<div className="flex items-center justify-between mb-2">
						<h3 className="font-semibold text-foreground text-sm sm:text-base">
							Active Sessions
						</h3>
						{(currentSession || restSessions.length > 0) && (
							<button
								className="flex items-center gap-2 text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/10 px-2 py-1 rounded-md transition-colors"
								onClick={handleTerminateAll}
								title="Log out everywhere"
							>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
									<polyline points="16,17 21,12 16,7"/>
									<line x1="21" y1="12" x2="9" y2="12"/>
								</svg>
								Log out everywhere
							</button>
						)}
					</div>
					<p className="text-xs text-muted-foreground sm:text-sm mb-4">Manage your sessions</p>

					<div className="space-y-4">
						{loading ? (
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M21 12a9 9 0 11-6.219-8.56"/>
								</svg>
								Loading sessions...
							</div>
						) : error ? (
							<div className="flex items-center gap-2 text-sm text-destructive">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<circle cx="12" cy="12" r="10"/>
									<line x1="15" y1="9" x2="9" y2="15"/>
									<line x1="9" y1="9" x2="15" y2="15"/>
								</svg>
								{error}
							</div>
						) : (
							<>
								{currentSession && (
									<div className="space-y-3">
										<h4 className="text-sm font-medium text-foreground">Current Session</h4>
										<div className="relative overflow-hidden p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/30 rounded-xl shadow-sm">
											{/* Декоративный элемент */}
											<div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-10 translate-x-10"></div>
											<div className="absolute bottom-0 left-0 w-16 h-16 bg-primary/5 rounded-full translate-y-8 -translate-x-8"></div>
											
											<div className="relative flex items-center justify-between">
												<div className="flex-1">
													<div className="flex items-center gap-3 mb-2">
														<div className="flex items-center gap-2">
															<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
																<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
															</svg>
															<span className="text-sm font-semibold text-foreground">{currentSession.device ?? "This Device"}</span>
														</div>
														<span className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
															<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																<path d="M20 6L9 17l-5-5"/>
															</svg>
															Current
														</span>
													</div>
													<div className="text-xs text-muted-foreground mb-1">
														{currentSession.city ? `${currentSession.city}, ` : ""}
														{currentSession.region ? `${currentSession.region}, ` : ""}
														{currentSession.country ?? ""}
													</div>
													<div className="text-xs text-muted-foreground">
														Last seen: {formatDate(currentSession.lastSeenAt)}
													</div>
													<div className="text-xs text-muted-foreground">
														Expires: {formatDate(currentSession.expires)}
													</div>
												</div>
												<div className="flex items-center gap-2">
													<span className="flex items-center gap-1 text-xs text-primary font-medium">
														<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
															<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
														</svg>
														Active
													</span>
												</div>
											</div>
										</div>
									</div>
								)}

								{restSessions.length > 0 && (
									<div className="space-y-3">
										<h4 className="text-sm font-medium text-foreground">Other Sessions</h4>
										<div className="space-y-3">
											{restSessions.map((session) => (
												<div key={session.id} className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 rounded-lg border border-border/50 transition-colors">
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-2">
															<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
																<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
																<line x1="8" y1="21" x2="16" y2="21"/>
																<line x1="12" y1="17" x2="12" y2="21"/>
															</svg>
															<span className="text-sm font-medium text-foreground">{session.device ?? "Other Device"}</span>
														</div>
														<div className="text-xs text-muted-foreground mb-1">
															{session.city ? `${session.city}, ` : ""}
															{session.region ? `${session.region}, ` : ""}
															{session.country ?? ""}
														</div>
														<div className="text-xs text-muted-foreground">
															Last seen: {formatDate(session.lastSeenAt)}
														</div>
														<div className="text-xs text-muted-foreground">
															Expires: {formatDate(session.expires)}
														</div>
													</div>
													<button 
														className="flex items-center gap-2 text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/10 px-3 py-2 rounded-md transition-colors" 
														onClick={() => handleTerminateSession(session.id)}
														title="Terminate session"
													>
														<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
															<path d="M18 6L6 18M6 6l12 12"/>
														</svg>
														Terminate
													</button>
												</div>
											))}
										</div>
									</div>
								)}

								{!currentSession && restSessions.length === 0 && (
									<div className="flex flex-col items-center gap-2 text-sm text-muted-foreground text-center py-8">
										<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
											<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
											<line x1="8" y1="21" x2="16" y2="21"/>
											<line x1="12" y1="17" x2="12" y2="21"/>
										</svg>
										No active sessions found
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Account;