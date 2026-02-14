const fs = require('fs').promises;

class StaticChartGenerator {
  constructor() {
    this.svgWidth = 400;
    this.svgHeight = 400;
    this.centerX = this.svgWidth / 2;
    this.centerY = this.svgHeight / 2;
    this.radius = 150;
  }

  async generateTimeAllocationChart(activities) {
    const total = activities.reduce((sum, activity) => sum + activity.hours, 0);
    let currentAngle = -90; // Start from top
    
    const paths = [];
    const legend = [];
    
    activities.forEach((activity, index) => {
      const percentage = (activity.hours / total) * 100;
      const angle = (activity.hours / total) * 360;
      
      // Create arc path
      const startAngleRad = (currentAngle * Math.PI) / 180;
      const endAngleRad = ((currentAngle + angle) * Math.PI) / 180;
      
      const x1 = this.centerX + this.radius * Math.cos(startAngleRad);
      const y1 = this.centerY + this.radius * Math.sin(startAngleRad);
      const x2 = this.centerX + this.radius * Math.cos(endAngleRad);
      const y2 = this.centerY + this.radius * Math.sin(endAngleRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const pathData = [
        `M ${this.centerX} ${this.centerY}`,
        `L ${x1} ${y1}`,
        `A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      paths.push({
        path: pathData,
        color: activity.color,
        activity: activity.activity,
        hours: activity.hours,
        percentage: percentage.toFixed(1)
      });
      
      currentAngle += angle;
    });
    
    // Generate SVG
    const svg = this.createDonutSVG(paths, activities);
    return svg;
  }

  createDonutSVG(paths, activities) {
    const innerRadius = 80;
    
    // Create donut paths
    const donutPaths = paths.map(segment => {
      const angle = (segment.hours / activities.reduce((sum, a) => sum + a.hours, 0)) * 360;
      const startAngle = paths.slice(0, paths.indexOf(segment))
        .reduce((sum, s) => sum + (s.hours / activities.reduce((sum, a) => sum + a.hours, 0)) * 360, -90);
      
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = ((startAngle + angle) * Math.PI) / 180;
      
      // Outer arc points
      const x1 = this.centerX + this.radius * Math.cos(startAngleRad);
      const y1 = this.centerY + this.radius * Math.sin(startAngleRad);
      const x2 = this.centerX + this.radius * Math.cos(endAngleRad);
      const y2 = this.centerY + this.radius * Math.sin(endAngleRad);
      
      // Inner arc points
      const x3 = this.centerX + innerRadius * Math.cos(endAngleRad);
      const y3 = this.centerY + innerRadius * Math.sin(endAngleRad);
      const x4 = this.centerX + innerRadius * Math.cos(startAngleRad);
      const y4 = this.centerY + innerRadius * Math.sin(startAngleRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const pathData = [
        `M ${x1} ${y1}`,
        `A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
        'Z'
      ].join(' ');
      
      return `<path d="${pathData}" fill="${segment.color}" stroke="white" stroke-width="2" opacity="0.9">
        <title>${segment.activity}: ${segment.hours}h (${segment.percentage}%)</title>
      </path>`;
    }).join('\n');
    
    return `
      <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <dropShadow dx="2" dy="2" stdDeviation="3" flood-color="#00000020"/>
          </filter>
        </defs>
        
        <!-- Background circle -->
        <circle cx="${this.centerX}" cy="${this.centerY}" r="${this.radius + 5}" fill="none" stroke="#f0f0f0" stroke-width="1"/>
        
        <!-- Donut segments -->
        ${donutPaths}
        
        <!-- Center circle -->
        <circle cx="${this.centerX}" cy="${this.centerY}" r="${innerRadius}" fill="var(--bg-primary)" stroke="var(--border-color)" stroke-width="2"/>
        
        <!-- Center text -->
        <text x="${this.centerX}" y="${this.centerY - 10}" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="bold" fill="var(--text-primary)">Daily</text>
        <text x="${this.centerX}" y="${this.centerY + 10}" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="bold" fill="var(--text-primary)">Activities</text>
        
        <style>
          path:hover {
            opacity: 1;
            filter: url(#shadow);
            transform-origin: ${this.centerX}px ${this.centerY}px;
            transform: scale(1.02);
            transition: all 0.3s ease;
          }
          
          text {
            pointer-events: none;
          }
        </style>
      </svg>
    `;
  }

  async generateSimpleBarChart(activities) {
    const maxHours = Math.max(...activities.map(a => a.hours));
    const chartWidth = 600;
    const chartHeight = 300;
    const barWidth = (chartWidth - 100) / activities.length;
    const barSpacing = 10;
    
    const bars = activities.map((activity, index) => {
      const barHeight = (activity.hours / maxHours) * (chartHeight - 100);
      const x = 50 + index * (barWidth + barSpacing);
      const y = chartHeight - 50 - barHeight;
      
      return `
        <rect x="${x}" y="${y}" width="${barWidth - barSpacing}" height="${barHeight}" 
              fill="${activity.color}" opacity="0.8" rx="4">
          <title>${activity.activity}: ${activity.hours}h</title>
        </rect>
        <text x="${x + (barWidth - barSpacing) / 2}" y="${chartHeight - 30}" 
              text-anchor="middle" font-size="10" fill="var(--text-secondary)" 
              transform="rotate(-45, ${x + (barWidth - barSpacing) / 2}, ${chartHeight - 30})">
          ${activity.activity.split(' ').slice(0, 2).join(' ')}
        </text>
        <text x="${x + (barWidth - barSpacing) / 2}" y="${y - 5}" 
              text-anchor="middle" font-size="12" font-weight="bold" fill="var(--text-primary)">
          ${activity.hours}h
        </text>
      `;
    }).join('\n');
    
    return `
      <svg width="${chartWidth}" height="${chartHeight}" viewBox="0 0 ${chartWidth} ${chartHeight}" xmlns="http://www.w3.org/2000/svg">
        <!-- Grid lines -->
        ${Array.from({length: 6}, (_, i) => {
          const y = 50 + (i * (chartHeight - 100) / 5);
          const value = Math.round(maxHours - (i * maxHours / 5));
          return `
            <line x1="50" y1="${y}" x2="${chartWidth - 50}" y2="${y}" stroke="var(--border-color)" stroke-width="1" opacity="0.3"/>
            <text x="40" y="${y + 4}" text-anchor="end" font-size="10" fill="var(--text-secondary)">${value}h</text>
          `;
        }).join('\n')}
        
        <!-- Bars -->
        ${bars}
        
        <!-- Axis lines -->
        <line x1="50" y1="50" x2="50" y2="${chartHeight - 50}" stroke="var(--text-secondary)" stroke-width="2"/>
        <line x1="50" y1="${chartHeight - 50}" x2="${chartWidth - 50}" y2="${chartHeight - 50}" stroke="var(--text-secondary)" stroke-width="2"/>
        
        <style>
          rect:hover {
            opacity: 1;
            transform: scaleY(1.05);
            transform-origin: bottom;
            transition: all 0.3s ease;
          }
        </style>
      </svg>
    `;
  }
}

module.exports = StaticChartGenerator;
