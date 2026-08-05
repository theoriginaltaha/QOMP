import React from 'react';
import './CardWidget.css';

interface CardWidgetProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
}

export const CardWidget: React.FC<CardWidgetProps> = ({ title, value, icon, subtitle, trend, trendValue, onClick }) => {
  return (
    <div className={`card-widget ${onClick ? 'clickable' : ''}`} onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
      <div className="card-widget-header">
        <h4 className="card-widget-title">{title}</h4>
        {icon && <div className="card-widget-icon">{icon}</div>}
      </div>
      <div className="card-widget-body">
        <h2 className="card-widget-value">{value}</h2>
        <div className="card-widget-footer">
          {trend && (
            <span className={`trend trend-${trend}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </span>
          )}
          {subtitle && <span className="subtitle">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
};
