import pygame
import sys
import random

pygame.init()
screen_width = 800
screen_height = 600
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("لعبة حرب فردية")
clock = pygame.time.Clock()

# تعريف ألوان
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREY = (150, 150, 150)
BACKGROUND_COLORS = [BLACK, (50, 50, 50), (100, 100, 100)]  # ألوان خلفية للمستويات

# رسم شكل إنسان للاعب
def create_player_image():
    player_image = pygame.Surface((50, 50), pygame.SRCALPHA)
    pygame.draw.rect(player_image, WHITE, pygame.Rect(20, 30, 10, 20))  # الجسم
    pygame.draw.line(player_image, WHITE, (25, 0), (25, 30), 2)  # العمود الفقري
    pygame.draw.line(player_image, WHITE, (20, 30), (10, 40), 2)  # الساقين
    pygame.draw.line(player_image, WHITE, (30, 30), (40, 40), 2)  # الساقين
    pygame.draw.line(player_image, WHITE, (20, 30), (10, 20), 2)  # الذراعين
    pygame.draw.line(player_image, WHITE, (30, 30), (40, 20), 2)  # الذراعين
    pygame.draw.circle(player_image, WHITE, (25, 10), 5)  # الرأس
    return player_image

# رسم شكل فضائي للعدو
def create_alien_image():
    alien_image = pygame.Surface((50, 50), pygame.SRCALPHA)
    pygame.draw.polygon(alien_image, WHITE, [(25, 0), (50, 30), (35, 50), (15, 50), (0, 30)])
    return alien_image

player_image = create_player_image()
alien_image = create_alien_image()

# تعريف الطلقة الخاصة بالشخصية
class PlayerBullet(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((10, 5))
        self.image.fill(WHITE)
        self.rect = self.image.get_rect(center=(x, y))
        self.speed = 10

    def update(self):
        self.rect.y -= self.speed
        if self.rect.y < 0:
            self.kill()  # حذف الطلقة عند الخروج من الشاشة

# تعريف الطلقة الخاصة بالعدو
class EnemyBullet(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((10, 5))
        self.image.fill(WHITE)
        self.rect = self.image.get_rect(center=(x, y))
        self.speed = 5

    def update(self):
        self.rect.y += self.speed
        if self.rect.y > screen_height:
            self.kill()  # حذف الطلقة عند الخروج من الشاشة

# تعريف العدو
class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = alien_image
        self.rect = self.image.get_rect(center=(x, y))
        self.last_shot = pygame.time.get_ticks()  # الوقت الأخير الذي أطلق فيه العدو النار

    def update(self):
        current_time = pygame.time.get_ticks()
        if current_time - self.last_shot > 2000:  # كل 2 ثانية، يطلق العدو طلقة
            self.last_shot = current_time
            new_bullet = EnemyBullet(self.rect.centerx, self.rect.bottom)
            enemy_bullets.add(new_bullet)

def move_player(keys):
    if keys[pygame.K_LEFT]:
        player_rect.x -= 5
    if keys[pygame.K_RIGHT]:
        player_rect.x += 5
    if keys[pygame.K_UP]:
        player_rect.y -= 5
    if keys[pygame.K_DOWN]:
        player_rect.y += 5

    # التأكد من عدم خروج الشخصية عن الإطار
    if player_rect.x < border_thickness:
        player_rect.x = border_thickness
    if player_rect.x > screen_width - player_rect.width - border_thickness:
        player_rect.x = screen_width - player_rect.width - border_thickness
    if player_rect.y < border_thickness:
        player_rect.y = border_thickness
    if player_rect.y > screen_height - player_rect.height - border_thickness:
        player_rect.y = screen_height - player_rect.height - border_thickness

def spawn_enemies(level):
    enemies = pygame.sprite.Group()
    for _ in range(level):
        x = random.randint(50, screen_width - 50)
        y = random.randint(50, screen_height // 2)
        enemy = Enemy(x, y)
        enemies.add(enemy)
    return enemies

# إعداد اللعبة
level = 1
score = 0
enemies = spawn_enemies(level)
player_bullets = pygame.sprite.Group()
enemy_bullets = pygame.sprite.Group()

# تعريف شخصية اللاعب
player_rect = player_image.get_rect(center=(screen_width // 2, screen_height - 50))

# تعريف إطار اللعبة
border_thickness = 10
border_color = WHITE

def draw_border():
    pygame.draw.rect(screen, border_color, pygame.Rect(0, 0, screen_width, border_thickness))  # أعلى
    pygame.draw.rect(screen, border_color, pygame.Rect(0, screen_height - border_thickness, screen_width, border_thickness))  # أسفل
    pygame.draw.rect(screen, border_color, pygame.Rect(0, 0, border_thickness, screen_height))  # يسار
    pygame.draw.rect(screen, border_color, pygame.Rect(screen_width - border_thickness, 0, border_thickness, screen_height))  # يمين

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    keys = pygame.key.get_pressed()
    move_player(keys)

    if keys[pygame.K_SPACE]:  # عند الضغط على مفتاح المسافة (Space)
        new_bullet = PlayerBullet(player_rect.centerx, player_rect.top)
        player_bullets.add(new_bullet)

    # تحديث الطلقات
    player_bullets.update()
    enemy_bullets.update()

    # فحص التصادمات
    for bullet in player_bullets:
        hit_list = pygame.sprite.spritecollide(bullet, enemies, True)
        if hit_list:
            bullet.kill()  # حذف الطلقة عند التصادم
            score += len(hit_list)  # زيادة النقاط بناءً على عدد الأعداء المصابين

    for bullet in enemy_bullets:
        if bullet.rect.colliderect(player_rect):
            pygame.quit()
            sys.exit()  # إنهاء اللعبة عند إصابة الشخصية

    # التحقق من مستوى جديد
    if not enemies:
        level += 1
        enemies = spawn_enemies(level)
        # تغيير لون الخلفية عند الانتقال لمستوى جديد
        screen.fill(BACKGROUND_COLORS[(level - 1) % len(BACKGROUND_COLORS)])

    # تحديث الأعداء
    enemies.update()

    screen.fill(BLACK)
    draw_border()
    screen.blit(player_image, player_rect)
    enemies.draw(screen)
    player_bullets.draw(screen)
    enemy_bullets.draw(screen)
    pygame.display.flip()
    clock.tick(30)
