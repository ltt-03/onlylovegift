import sys

filename = '/Users/lethanhtunggmail.com/onlylovegift/server/templates/x-mas-tree/style/style.css'

with open(filename, 'r') as f:
    lines = f.readlines()

# find index of "#fullscreen-btn:hover {"
idx = -1
for i, line in enumerate(lines):
    if line.startswith('body {') and lines[i-1].strip() == 'box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);':
        idx = i
        break

if idx != -1:
    # find where to resume
    resume_idx = -1
    for i in range(idx, len(lines)):
        if lines[i].startswith('.hint-text {'):
            resume_idx = i
            break
            
    if resume_idx != -1:
        new_lines = lines[:idx]
        new_lines.append('}\n\n')
        new_lines.append('.upload-btn:hover { \n')
        new_lines.append('    background: #d4af37; \n')
        new_lines.append('    color: #000; \n')
        new_lines.append('    box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);\n')
        new_lines.append('}\n\n')
        new_lines.extend(lines[resume_idx:])
        
        with open(filename, 'w') as f:
            f.writelines(new_lines)
        print("Fixed successfully")
    else:
        print("Could not find resume point")
else:
    print("Could not find start point")
