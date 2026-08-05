import React from 'react';

interface MeetingsSectionProps {
  meetings: any[];
  onAddMeeting: () => void;
}

export const MeetingsSection: React.FC<MeetingsSectionProps> = ({ meetings, onAddMeeting }) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Meetings & Touchpoints</h3>
        <button className="btn-primary" onClick={onAddMeeting}>Log Meeting</button>
      </div>
      {(!meetings || meetings.length === 0) ? (
        <p style={{ color: 'var(--text-secondary)' }}>No meetings logged.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {meetings.map((meeting: any) => (
            <div key={meeting.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <strong>{meeting.title}</strong> <span style={{ color: 'var(--primary-color)', fontSize: '0.8rem' }}>({meeting.type})</span>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Date: {meeting.date} | Organizer: {meeting.organizer}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
