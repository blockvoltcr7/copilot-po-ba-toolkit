# PI 26.2 Retrospective Notes

Team: Portfolio Services (Mustangs)
PI: 26.2 (Jan 6 - Apr 25, 2026)
Sprints: 8 (two-week)
Facilitator: Maria Chen (Scrum Master)

## Raw Notes from Miro Board

### Green Sticky Notes (Positive)
- Great collaboration between frontend and backend teams on the portfolio dashboard rewrite
- Mike's spike on the new caching layer saved us weeks of debugging later
- We actually completed 90% of our PI objectives this time - best ever
- Standup format change (async on Mon/Wed, sync on Tue/Thu) worked really well
- New team members Sarah and James ramped up faster than expected thanks to improved onboarding docs
- Code review turnaround improved from 2 days to same-day after we set the SLA
- The feature flag system finally paid off - we could deploy daily without fear
- Pair programming sessions for complex features were hugely valuable
- Sprint velocity stabilized around 34-38 points (was 20-45 before)

### Red Sticky Notes (Negative)
- Cross-team dependency with the Auth team blocked us for 3 weeks in Sprint 4
- Story WEALTH-2301 was way too big - should have been split into 3 stories
- We kept carrying over stories from sprint to sprint - averaged 2 carryover stories per sprint
- Test environment was down for 4 days in Sprint 6, killed our velocity
- Requirements from Aha were vague again - spent too much time in refinement guessing what business actually wants
- Sprint 7 had zero time for tech debt because we were catching up on carryover
- The new monitoring tool (DataDog) rollout was chaotic - no training, docs were wrong
- UI/UX reviews happening too late - Sprint 5 we had to redo an entire component
- Estimation accuracy was poor on backend stories - consistently underestimated by 30-40%

### Blue Sticky Notes (Actions / Ideas)
- We should do design reviews at the START of the sprint, not the end
- Let's create a dependency tracking board so we can see cross-team blockers early
- Need a "definition of ready" checklist so vague stories don't enter the sprint
- Can we get a dedicated test environment? Sharing with 3 other teams is killing us
- Someone should own the DataDog rollout properly - maybe James since he has monitoring experience
- We should add estimation calibration sessions quarterly - compare estimates vs actuals
- Let's try mob programming for the really complex features instead of just pair programming
- We need to push back on Aha requirements that don't have clear acceptance criteria
- Tech debt should get 20% of each sprint - make it a standing commitment not an afterthought

### Metrics Discussed
- Average velocity: 36 points/sprint
- Sprint completion rate: 82%
- Carryover rate: 2.1 stories/sprint average
- Defects escaped to prod: 4 (down from 11 in PI 26.1)
- PI objectives met: 9 of 10 (90%)
- Team satisfaction (survey): 7.4/10

### Hot Topics
- Big debate about whether to adopt trunk-based development vs current GitFlow
- Some tension about remote vs in-office days - team split 50/50
- Several people frustrated about the Aha requirements quality - "we spend half our refinement time just figuring out what the business actually wants"
- Should we change our sprint cadence? Some want 1-week sprints for faster feedback
