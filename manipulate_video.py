from moviepy.editor import *
import random
from PIL import Image, ImageDraw, ImageFont
import sys

def create_outro_img(width,height):
    bg_color = (0, 0, 0)  

    image = Image.new("RGB", (width, height), bg_color)

    font = ImageFont.truetype("arial.ttf", 50)
    text_1 = "Get Pattern"
    text_2 = "Trading Ebook"
    text_3 = "www.uncashy.com"

    text_size_1 = font.getsize(text_1)
    text_size_2 = font.getsize(text_2)
    text_size_3 = font.getsize(text_3)
    
    x1 = (width - text_size_1[0]) / 2
    x2 = (width - text_size_2[0]) / 2
    x3 = (width - text_size_3[0]) / 2
    y3 = (height - text_size_3[1]) / 2

    draw = ImageDraw.Draw(image)
    draw.text((x1, y3-180),text_1 , font=font, fill=(255, 255, 255))  
    draw.text((x2, y3-100),text_2 , font=font, fill=(255, 255, 255))  
    draw.text((x3, y3), text_3, font=font, fill=(255, 255, 0))  

    image.save("outputs/outro.png")


def get_speed_choice():
    # speed_choices = ["speed_up", "normal","speed_up","normal"]
    speed_choices = ["speed_up", "slow_down", "normal","speed_up","speed_up","slow_down"]
    return random.choice(speed_choices)

video_clip = VideoFileClip("outputs/video.mp4")
audio_clip = video_clip.audio
video_clip = video_clip.without_audio()

t=0
t_increment = 0.03
video_clips = []

while t + t_increment <  video_clip.duration:
    speed_choice = get_speed_choice()

    if speed_choice == "normal":
        video_clips.append(video_clip.subclip(t, t+t_increment))
    elif speed_choice == "speed_up":
        speed_rnd = random.uniform(0.4, 0.8)
        video_clips.append(video_clip.subclip(t, t+t_increment).speedx(1+speed_rnd))
    elif speed_choice =="slow_down":
        speed_rnd = random.uniform(0.2, 0.6)
        video_clips.append(video_clip.subclip(t, t+t_increment).speedx(1-speed_rnd))
    
    t+=t_increment
    
# # create outro image
# width, height = video_clip.size
# create_outro_img(width, height)
# image_clip = ImageClip("outputs/outro.png").set_duration(2)

# video_clips.append(image_clip)
final_video_clip = concatenate_videoclips(video_clips)

final_clip = final_video_clip.set_audio(audio_clip)
final_clip.set_duration(final_video_clip.duration)
output_path = sys.argv[1]

final_clip.write_videofile(output_path, fps=video_clip.fps)



