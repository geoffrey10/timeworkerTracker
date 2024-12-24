import tkinter as tk
from tkinter import messagebox
import csv
from datetime import datetime, timedelta

# 文件路径
FILE_PATH = '/Users/a58/Desktop/日常/AIproject/attendance.csv'

# 初始化 CSV 文件
def initialize_csv():
    try:
        with open(FILE_PATH, 'x', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['Date', 'Day', 'Check-in', 'Check-out', 'Work Hours'])
    except FileExistsError:
        pass

# 获取当天记录
def get_today_record():
    today = datetime.now().strftime('%Y-%m-%d')
    try:
        with open(FILE_PATH, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['Date'] == today:
                    return row
    except FileNotFoundError:
        pass
    return None

# 保存记录到 CSV 文件
def save_record(date, day, check_in, check_out, work_hours):
    records = []
    found = False
    try:
        with open(FILE_PATH, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['Date'] == date:
                    row['Check-in'] = check_in
                    row['Check-out'] = check_out
                    row['Work Hours'] = work_hours
                    found = True
                records.append(row)
    except FileNotFoundError:
        pass

    if not found:
        records.append({'Date': date, 'Day': day, 'Check-in': check_in, 'Check-out': check_out, 'Work Hours': work_hours})

    with open(FILE_PATH, 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=['Date', 'Day', 'Check-in', 'Check-out', 'Work Hours'])
        writer.writeheader()
        writer.writerows(records)

# 自动记录上班时间
def record_check_in():
    today = datetime.now().strftime('%Y-%m-%d')
    day = datetime.now().strftime('%A')
    now = datetime.now().strftime('%H:%M:%S')

    record = get_today_record()
    if record:
        check_in_time = record['Check-in']
        if not check_in_time or now < check_in_time:
            check_in_time = now
        save_record(today, day, check_in_time, record['Check-out'], record['Work Hours'])
    else:
        save_record(today, day, now, '', '')

    check_in_label.config(text=f"Check-in: {check_in_time}")
    messagebox.showinfo("Success", "Check-in time recorded!")

# 自动记录下班时间
def record_check_out():
    today = datetime.now().strftime('%Y-%m-%d')
    day = datetime.now().strftime('%A')
    now = datetime.now().strftime('%H:%M:%S')

    record = get_today_record()
    if record:
        check_out_time = record['Check-out']
        if not check_out_time or now > check_out_time:
            check_out_time = now
        work_hours = calculate_work_hours(record['Check-in'], check_out_time) if record['Check-in'] else ''
        save_record(today, day, record['Check-in'], check_out_time, work_hours)
    else:
        save_record(today, day, '', now, '')

    check_out_label.config(text=f"Check-out: {now}")
    messagebox.showinfo("Success", "Check-out time recorded!")

# 计算工时
def calculate_work_hours(check_in, check_out):
    try:
        check_in_time = datetime.strptime(check_in, '%H:%M:%S')
        check_out_time = datetime.strptime(check_out, '%H:%M:%S')
        work_hours = (check_out_time - check_in_time).seconds / 3600
        return round(work_hours, 2)
    except ValueError:
        return ''

# 计算每周平均工时
def calculate_weekly_average():
    weekly_data = {}
    try:
        with open(FILE_PATH, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['Check-in'] and row['Check-out']:
                    date = datetime.strptime(row['Date'], '%Y-%m-%d')
                    week_start = (date - timedelta(days=date.weekday())).strftime('%Y-%m-%d')
                    weekly_data.setdefault(week_start, []).append(float(row['Work Hours']))
    except FileNotFoundError:
        pass

    weekly_averages = []
    for week_start, hours in weekly_data.items():
        avg_hours = round(sum(hours) / len(hours), 2)
        weekly_averages.append(f"Week of {week_start}: {avg_hours} hours")

    weekly_avg_label.config(text="\n".join(weekly_averages))

# 主程序界面
def create_gui():
    window = tk.Tk()
    window.title("Attendance Tracker")
    window.geometry("400x400")

    # 显示打卡时间
    global check_in_label, check_out_label, weekly_avg_label
    check_in_label = tk.Label(window, text="Check-in: Not Recorded", font=("Arial", 12))
    check_in_label.pack(pady=10)
    check_out_label = tk.Label(window, text="Check-out: Not Recorded", font=("Arial", 12))
    check_out_label.pack(pady=10)

    # 按钮布局
    button_style = {'font': ('Arial', 12), 'width': 20, 'height': 2}
    check_in_button = tk.Button(window, text="Record Check-in", command=record_check_in, **button_style)
    check_in_button.pack(pady=10)
    check_out_button = tk.Button(window, text="Record Check-out", command=record_check_out, **button_style)
    check_out_button.pack(pady=10)

    # 每周平均工时
    avg_button = tk.Button(window, text="Calculate Weekly Average", command=calculate_weekly_average, **button_style)
    avg_button.pack(pady=10)

    # 显示每周平均工时
    weekly_avg_label = tk.Label(window, text="Weekly Average Work Hours: None", font=("Arial", 12))
    weekly_avg_label.pack(pady=10)

    # 初始化 CSV
    initialize_csv()

    # 启动 Tkinter 主循环
    window.mainloop()

if __name__ == '__main__':
    create_gui()
