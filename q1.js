function logEvent(eventType, eventObject) {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp}, ${eventType}, ${eventObject}`);
}

function showTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
    tab.classList.add('hidden');
  });

  const activeTab = document.getElementById(tabName);
  if (activeTab) {
    activeTab.classList.remove('hidden');
    activeTab.classList.add('active');
  }

  document.querySelectorAll('.navbar a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${tabName}`) {
      link.classList.add('active');
    }
  });

  logEvent('view', `tab-${tabName}`);
}

function toggleTheme(isDarkMode) {
  document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  logEvent('click', isDarkMode ? 'theme-toggle-dark' : 'theme-toggle-light');

  if (isDarkMode) {
    stopSpringAnimations();
    initMatrixRain();
  } else {
    stopMatrixRain();
    initSpringAnimations();
  }

  document.querySelectorAll('.theme-switch input, #theme-toggle').forEach(toggle => {
    toggle.checked = isDarkMode;
  });
}

const profileImages = [
  "profile.jpeg", 
  "profile0.jpeg",
  "profile1.jpeg",
  "profile2.jpeg",
  "profile3.jpeg",
  "profile4.jpeg",
  "profile5.jpeg"
];

let currentImageIndex = 0;

function changeProfileImage() {
  currentImageIndex = (currentImageIndex + 1) % profileImages.length;
  const profileImgElement = document.getElementById("profile-img");
  if (profileImgElement) {
    profileImgElement.src = profileImages[currentImageIndex];
    logEvent('click', 'profile-image-change');
  }
}

function initTypewriterEffects() {
  document.querySelectorAll('.typewriter-text').forEach(el => {
    const text = el.dataset.text;
    let i = 0;
    const speed = 50; 
    
    function typeWriter() {
      if (i < text.length) {
        el.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      } else {
        el.style.borderRight = 'none';
      }
    }
    
    el.innerHTML = '';
    typeWriter();
  });
}

let matrixInterval;

function getRandomMatrixChar() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return chars.charAt(Math.floor(Math.random() * chars.length));
}

function createMatrixColumns() {
  const container = document.querySelector('.matrix-bg');
  if (!container) return;
  
  const columnCount = Math.floor(window.innerWidth / 20);
  container.innerHTML = '';
  
  for (let i = 0; i < columnCount; i++) {
    const column = document.createElement('div');
    column.className = 'matrix-column';
    column.style.left = `${i * 20 + Math.random() * 10}px`;
    
    if (i % 3 === 0) {
      column.style.animationDuration = '20s';
    } else if (i % 3 === 1) {
      column.style.animationDuration = '25s';
    } else {
      column.style.animationDuration = '30s';
    }
    
    const charCount = 10 + Math.floor(Math.random() * 15);
    for (let j = 0; j < charCount; j++) {
      const span = document.createElement('span');
      span.textContent = getRandomMatrixChar();
      span.style.animationDelay = `${j * 0.1}s`;
      column.appendChild(span);
    }
    container.appendChild(column);
  }
}

function updateMatrixRain() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  const spans = document.querySelectorAll('.matrix-column span');
  const updateCount = Math.ceil(spans.length * 0.02);
  
  for (let i = 0; i < updateCount; i++) {
    const randomIndex = Math.floor(Math.random() * spans.length);
    spans[randomIndex].textContent = getRandomMatrixChar();
  }
}

function initMatrixRain() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  if (matrixInterval) clearInterval(matrixInterval);
  
  createMatrixColumns();
  matrixInterval = setInterval(updateMatrixRain, 200);
}

function stopMatrixRain() {
  clearInterval(matrixInterval);
  matrixInterval = null;
  const container = document.querySelector('.matrix-bg');
  if (container) container.innerHTML = '';
}

function initScrollTracking() {
  let lastScroll = 0;
  let timeout;
  let lastLogTime = 0;
  
  window.addEventListener('scroll', () => {
    clearTimeout(timeout);
    
    const now = Date.now();
    if (now - lastLogTime < 1000) return;
    
    timeout = setTimeout(() => {
      const pos = window.scrollY;
      const dir = pos > lastScroll ? 'down' : 'up';
      lastScroll = pos;
      const percent = (pos / (document.body.scrollHeight - window.innerHeight)) * 100;
      const section = Math.floor(percent / 25);
      logEvent('view', `scroll-section-${section}-${dir}`);
      lastLogTime = now;
    }, 300);
  });
}

function initClickTracking() {
  let lastClickTime = 0;
  
  document.addEventListener('click', e => {
    const now = Date.now();
    if (now - lastClickTime < 300) return;
    
    const el = e.target;
    const tag = el.tagName.toLowerCase();
    const id = el.id || 'no-id';
    const cls = el.className || 'no-class';
    let type = tag;
    
    if (tag === 'a') type = 'link';
    else if (tag === 'button') type = 'button';
    else if (tag === 'input') type = `input-${el.type}`;
    else if (tag === 'img') type = 'image';
    else if (tag === 'select') type = 'dropdown';
    
    logEvent('click', `${type}#${id}.${cls}`);
    lastClickTime = now;
  });
}

function initAppearOnScroll() {
  const items = document.querySelectorAll('.appear-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    });
    
    items.forEach(item => observer.observe(item));
  } else {
    const check = () => {
      items.forEach(item => {
        if (item.getBoundingClientRect().top < window.innerHeight * 0.9) {
          item.classList.add('is-visible');
        }
      });
    };
    window.addEventListener('scroll', check);
    check();
  }
}

function initPersonalPageTracking() {
  const aboutSection = document.querySelector('.about, #about, .about-me, #about-me');
  if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          logEvent('view', 'about-section');
        }
      });
    }, { threshold: 0.5 });
    observer.observe(aboutSection);
  }
  
  const profileImage = document.querySelector('#profile-img, .profile-img, .avatar');
  if (profileImage) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          logEvent('view', 'profile-picture');
        }
      });
    }, { threshold: 0.5 });
    observer.observe(profileImage);
  }
  
  const birthplaceImages = document.querySelectorAll('.birthplace-img, .hometown-img, .local-img');
  birthplaceImages.forEach(img => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          logEvent('view', 'birthplace-image');
        }
      });
    }, { threshold: 0.5 });
    observer.observe(img);
    
    img.addEventListener('click', () => {
      logEvent('click', 'birthplace-image');
    });
  });
  
  const educationSection = document.querySelector('.education, #education, .education-bg');
  if (educationSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          logEvent('view', 'education-section');
        }
      });
    }, { threshold: 0.5 });
    observer.observe(educationSection);
  }
  
  const skillsSection = document.querySelector('.skills, #skills, .technical-skills');
  if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          logEvent('view', 'skills-section');
        }
      });
    }, { threshold: 0.5 });
    observer.observe(skillsSection);
  }
  
  const cvLink = document.querySelector('a[href$=".pdf"], .cv-link, .resume-link');
  if (cvLink) {
    cvLink.addEventListener('click', () => {
      logEvent('click', 'cv-download');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  logEvent('view', 'page-load');

  if (!document.querySelector('.matrix-bg')) {
    const bg = document.createElement('div');
    bg.className = 'matrix-bg';
    document.body.appendChild(bg);
  }
  if (!document.querySelector('.spring-bg')) {
    const bg = document.createElement('div');
    bg.className = 'spring-bg';
    document.body.appendChild(bg);
  }

  const theme = localStorage.getItem('theme') || 'dark';
  toggleTheme(theme === 'dark');

  showTab('home');

  document.querySelectorAll('.navbar a, [data-tab]').forEach(link => {
    if (link.getAttribute('target') === '_blank') {
      return;
    }
    
    link.addEventListener('click', e => {
      e.preventDefault();
      const tab = link.getAttribute('href')?.substring(1) || link.dataset.tab;
      showTab(tab);
      logEvent('click', `tab-navigation-${tab}`);
    });
  });

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      toggleTheme(themeToggle.checked);
    });
  }

  const profile = document.getElementById('profile-img');
  if (profile) profile.addEventListener('click', changeProfileImage);

  initScrollTracking();
  initClickTracking();
  initAppearOnScroll();
  initTypewriterEffects();
  initPersonalPageTracking(); 

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const theme = document.body.className.includes('dark-mode') ? 'dark' : 'light';
      if (theme === 'dark') {
        stopMatrixRain();
        initMatrixRain();
      } else {
        stopSpringAnimations();
        initSpringAnimations();
      }
    }, 300);
  });
});

function toggleTheme(isDarkMode) {
  document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  logEvent('click', isDarkMode ? 'theme-toggle-dark' : 'theme-toggle-light');
  
  stopMatrixRain();
  initMatrixRain();
  
  document.querySelectorAll('.theme-switch input, #theme-toggle').forEach(toggle => {
      toggle.checked = isDarkMode;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  logEvent('view', 'page-load');
  
  const bg = document.createElement('div');
  bg.className = 'matrix-bg';
  document.body.appendChild(bg);
  
  initMatrixRain();
});

function showTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
      tab.classList.add('hidden');
  });
  
  const activeTab = document.getElementById(tabName);
  if (activeTab) {
      activeTab.classList.remove('hidden');
      activeTab.classList.add('active');
      
      if (tabName === 'typewriter-tab') { 
          startTypewritingEffect(); 
      }
      
      logEvent('view', `tab-${tabName}`);
  }
}

let typingInterval;

function startTypewritingEffect() {
    const element = document.getElementById('typewriter');
    const text = "Your typewriting text here...";
    let index = 0;

    if (typingInterval) clearInterval(typingInterval); 

    typingInterval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(typingInterval); 
        }
    }, 100); 
}

function stopTypewritingEffect() {
  clearInterval(typingInterval);
}

function showTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
      tab.classList.add('hidden');
      
      if (tab.id === 'typewriter-tab') { 
          stopTypewritingEffect(); 
      }
  });
  
  const activeTab = document.getElementById(tabName);
  if (activeTab) {
      activeTab.classList.remove('hidden');
      activeTab.classList.add('active');
      
      if (tabName === 'typewriter-tab') { 
          startTypewritingEffect();
      }
      
      logEvent('view', `tab-${tabName}`);
  }
}

function initMatrixCanvas() {
  let canvas = document.getElementById('matrix-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.className = 'matrix-canvas';
    document.body.appendChild(canvas);
  }
  
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  
  const chars = '01';
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  
  function calculateColumns() {
    columns = Math.floor(canvas.width / fontSize);
    return columns;
  }
  
  let drops = [];
  function initDrops() {
    drops = [];
    const cols = calculateColumns();
    for (let i = 0; i < cols; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height);
    }
  }
  initDrops();
  
  let animationId;
  let lastTime = 0;
  const frameRate = 30; 
  const frameInterval = 1000 / frameRate;
  
  function draw(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    
    if (deltaTime > frameInterval) {
      lastTime = timestamp - (deltaTime % frameInterval);
      
      const isDarkMode = document.body.classList.contains('dark-mode');
      
      ctx.fillStyle = isDarkMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = isDarkMode ? 'rgba(0, 255, 204, 0.5)' : 'rgba(255, 64, 129, 0.5)';
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        
        ctx.fillText(text, i * fontSize, drops[i]);
        
        if (drops[i] > canvas.height || Math.random() > 0.98) {
          drops[i] = Math.floor(Math.random() * -canvas.height);
        }
        
        drops[i] += fontSize;
      }
    }
    
    animationId = requestAnimationFrame(draw);
  }
  
  animationId = requestAnimationFrame(draw);
  
  function handleResize() {
    resizeCanvas();
    initDrops();
  }
  
  window.addEventListener('resize', handleResize);
  
  return function stopMatrixCanvas() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    window.removeEventListener('resize', handleResize);
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .matrix-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
  
  window.stopMatrixCanvas = initMatrixCanvas();
  
  const originalToggleTheme = window.toggleTheme;
  if (typeof originalToggleTheme === 'function') {
    window.toggleTheme = function(isDarkMode) {
      originalToggleTheme(isDarkMode);
      
      if (window.stopMatrixCanvas) {
        window.stopMatrixCanvas();
        window.stopMatrixCanvas = initMatrixCanvas();
      }
    };
  }
});

function showTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
    tab.classList.add('hidden');
  });

  const activeTab = document.getElementById(tabName);
  if (activeTab) {
    activeTab.classList.remove('hidden');
    activeTab.classList.add('active');
  }

  document.querySelectorAll('.navbar a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${tabName}`) {
      link.classList.add('active');
    }
  });

  logEvent('view', `tab-${tabName}`);
}
