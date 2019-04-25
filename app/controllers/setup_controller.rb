class SetupController < ApplicationController
  skip_before_action :verify_authenticity_token
 
  
  def index
    @current_user ||= User.find_by_id(session[:user_id])
   # @subjects = @current_user.subjects
  end
  
  def new
    
  end
  
  def day_to_int(day_of_week)
    case day_of_week
      when "mon" then day = 1
      when "tue" then day = 2
      when "wed" then day = 3
      when "thu" then day = 4
      when "fri" then day = 5
      when "sat" then day = 6
      when "sun" then day = 7
    end
    return day
  end  
  
  def day_to_string(day_of_week)
    case day_of_week
      when 1 then day = "Monday"
      when 2 then day = "Tuesday"
      when 3 then day = "Wednesday"
      when 4 then day = "Thursday"
      when 5 then day = "Friday"
      when 6 then day = "Saturday"
      when 7 then day = "Sunday"
    end
    return day
  end
  
  def isComplete(sch, subject_name, completed_schedules)
    completed_schedules.each do |schedule|
      if schedule["subject_name"]== subject_name and schedule["day_of_week"] == sch.day_of_week and
        schedule["start_time"] == sch.start_time.strftime("%H:%M:%S") and schedule["end_time"] == sch.end_time.strftime("%H:%M:%S") and schedule["dates"] == sch.dates
        return true
      end
    end
    return false
  end
  
  def create
    subjects = params[:subjects]
    sql = "select * from schedules where subject_id in (select id from subjects where user_id=" + @current_user.id.to_s + " and completed=true)"
    completed_schedules = ActiveRecord::Base.connection.execute(sql)
    completed_schedules = completed_schedules.as_json
    completed_schedules.each do |schedule|
      subject_id = schedule["subject_id"]
      schedule["subject_name"] = Subject.find_by_id(subject_id)["name"]
    end
    subjects.each do |key,value|
      subject = Subject.new
      subject.name = value[:name] 
      subject.start_date = value[:start_date]
      subject.end_date = value[:end_date]
      subject.hours = value[:hours]
      schedule_list = value[:schedules]
      schedule_list.each do |k,v|
        sch = Schedule.new
        sch.day_of_week = day_to_int(v[:day])
        sch.start_time = v[:start]
        sch.end_time = v[:end]
        sch.dates = v[:dates]
        if isComplete(sch, subject.name, completed_schedules)
          sch.completed = true
        else
          sch.completed = false
        end
        subject.schedules << sch
      end
      @current_user.subjects << subject
    end 
    
    if @current_user.save!
      redirect_to dashboard_index_path
    end
  end
  
  def edit
    
  end
  
  def destroy
    #sql = "select * from subjects where user_id=" + @current_user.id.to_s
    #subjects = ActiveRecord::Base.connection.execute(sql)
    @current_user = User.find_by_id(session[:user_id])
    subjects = @current_user.subjects.all
    #completed_subjects = []
    subjects.each do |subject|
      schedules = subject.schedules
      i=0
      schedules.each do |schedule|
        break if schedule.completed == false
        i+=1
      end
      if i == schedules.length
        subject.destroy
      end
    end
    redirect_to root_url
  end

  
end