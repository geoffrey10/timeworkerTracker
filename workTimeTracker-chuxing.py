import tkinter as tk
from tkinter import messagebox
import csv
from datetime import datetime
from collections import defaultdict

# 文件路径
FILE_PATH = '/Users/a58/Desktop/日常/AIproject/attendance.csv'

# 初始化 CSV 文件
def initialize_csv():
    try:
        with open(FILE_PATH, 'x', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['Date', 'Check-in', 'Check-out', 'Work Hours'])
    except FileExistsError:
        pass

# 记录打卡时间
def record_attendance(date, check_in, check_out):
    work_hours = calculate_work_hours(check_in, check_out)
    with open(FILE_PATH, 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([date, check_in, check_out, work_hours])
    update_daily_hours(date, work_hours)

# 计算工时
def calculate_work_hours(check_in, check_out):
    fmt = '%H:%M'
    in_time = datetime.strptime(check_in, fmt)
    out_time = datetime.strptime(check_out, fmt)
    return round((out_time - in_time).seconds / 3600, 2)

# 更新每日工时显示
def update_daily_hours(date, work_hours):
    daily_hours_label.config(text=f"Date: {date}\nWork Hours: {work_hours} hours")

# 计算每周平均工时
def calculate_weekly_average():
    weekly_data = defaultdict(list)
    with open(FILE_PATH, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            date = datetime.strptime(row['Date'], '%Y-%m-%d')
            work_hours = float(row['Work Hours'])
            week = date.strftime('%Y-W%U')
            weekly_data[week].append(work_hours)

    weekly_averages = []
    for week, hours in weekly_data.items():
        avg_hours = round(sum(hours) / len(hours), 2)
        weekly_averages.append(f"Week {week}: {avg_hours} hours")

    weekly_avg_label.config(text="\n".join(weekly_averages))

# 主程序界面
def create_gui():
    window = tk.Tk()
    window.title("Attendance Tracker")

    # 日期输入框
    date_label = tk.Label(window, text="Date (YYYY-MM-DD):")
    date_label.pack()
    date_entry = tk.Entry(window)
    date_entry.pack()

    # 上班时间输入框
    check_in_label = tk.Label(window, text="Check-in Time (HH:MM):")
    check_in_label.pack()
    check_in_entry = tk.Entry(window)
    check_in_entry.pack()

    # 下班时间输入框
    check_out_label = tk.Label(window, text="Check-out Time (HH:MM):")
    check_out_label.pack()
    check_out_entry = tk.Entry(window)
    check_out_entry.pack()

    # 按钮：记录打卡
    def on_record_button_click():
        date = date_entry.get()
        check_in = check_in_entry.get()
        check_out = check_out_entry.get()
        if not date or not check_in or not check_out:
            messagebox.showerror("Input Error", "Please fill in all fields.")
            return
        try:
            record_attendance(date, check_in, check_out)
            messagebox.showinfo("Success", "Attendance recorded successfully.")
        except Exception as e:
            messagebox.showerror("Error", str(e))

    record_button = tk.Button(window, text="Record Attendance", command=on_record_button_click)
    record_button.pack()

    # 显示每日工时
    global daily_hours_label
    daily_hours_label = tk.Label(window, text="Daily Work Hours: None")
    daily_hours_label.pack()

    # 按钮：计算每周平均工时
    def on_avg_button_click():
        calculate_weekly_average()

    avg_button = tk.Button(window, text="Calculate Weekly Average", command=on_avg_button_click)
    avg_button.pack()

    # 显示每周平均工时
    global weekly_avg_label
    weekly_avg_label = tk.Label(window, text="Weekly Average Work Hours: None")
    weekly_avg_label.pack()

    # 初始化 CSV
    initialize_csv()

    # 启动 Tkinter 主循环
    window.mainloop()

if __name__ == '__main__':
    create_gui()
