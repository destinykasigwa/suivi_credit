<aside class="main-sidebar elevation-4" style="background: linear-gradient(180deg, #1a2632 0%, #0f1419 100%); position: fixed; top: 0; left: 0; height: 100vh; width: 250px; z-index: 999; box-shadow: 2px 0 12px rgba(0,0,0,0.1);">
  
  <!-- Sidebar -->
  <div class="sidebar" style="height: 100vh; display: flex; flex-direction: column;">
    
    <!-- Logo/Header -->
    <div class="user-panel mt-3 pb-3 mb-3 d-flex align-items-center justify-content-center" style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px !important;">
      <div class="text-center">
       
        <div class="mb-2 d-flex justify-content-center">
            <a href="/">
          <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #20c997 0%, #198764 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
            <i class="fas fa-chart-line" style="color: white; font-size: 24px;"></i>
          </div>
          </a>
        </div>
      </a>
       <a href="/" class="d-block text-light"
                     style="font-size: 30px;margin-top:-10px"><strong><i style="color: #fff">C</i><i style="color: teal">redi</i><i style="color:#fff ">X</i></strong></a>
        <small class="text-muted" style="font-size: 11px;">Gestion de crédit</small>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="mt-2" style="flex: 1; overflow-y: auto; overflow-x: hidden;">
      <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false" style="padding: 0 12px;">
        
        <!-- Menu Rapport -->
        <li class="nav-item menu-open mb-2">
          <a href="#" class="nav-link" style="border-radius: 10px; transition: all 0.2s ease;" data-toggle="collapse" data-target="#rapport-submenu" aria-expanded="true">
            <div class="d-flex align-items-center gap-3">
              <div style="width: 32px; height: 32px; background: rgba(32, 201, 151, 0.15); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-chart-line" style="color: #20c997; font-size: 14px;"></i>
              </div>
              <span style="font-weight: 500;">RAPPORT</span>
              <i class="fas fa-chevron-down ms-auto" style="font-size: 12px; transition: transform 0.2s ease;"></i>
            </div>
          </a>
          <ul class="nav nav-treeview collapse show" id="rapport-submenu" style="padding-left: 20px; margin-top: 8px;">
            <li class="nav-item">
              <a href="{{ route('gestion_credit.pages.credit-decaisse') }}" class="nav-link d-flex align-items-center gap-2" style="border-radius: 8px; padding: 8px 12px; transition: all 0.2s ease;">
                <i class="fas fa-circle" style="font-size: 6px; color: #20c997;"></i>
                <span>Crédits décaissés</span>
              </a>
            </li>
          </ul>
        </li>

        <!-- Séparateur -->
        <li class="nav-header px-3 my-3">
          <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);"></div>
        </li>

        <!-- Menu Paramètre -->
        <li class="nav-item mb-2">
          <a href="#" class="nav-link" style="border-radius: 10px; transition: all 0.2s ease;" data-toggle="collapse" data-target="#parametre-submenu" aria-expanded="false">
            <div class="d-flex align-items-center gap-3">
              <div style="width: 32px; height: 32px; background: rgba(108, 117, 125, 0.15); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-cog" style="color: #adb5bd; font-size: 14px;"></i>
              </div>
              <span style="font-weight: 500;">Paramètre</span>
              <i class="fas fa-chevron-right ms-auto" style="font-size: 12px; transition: transform 0.2s ease;"></i>
            </div>
          </a>
          <ul class="nav nav-treeview collapse" id="parametre-submenu" style="padding-left: 20px; margin-top: 8px;">
            <li class="nav-item">
              <a href="{{ route('gestion_credit.pages.utilisateurs') }}" class="nav-link d-flex align-items-center gap-2" style="border-radius: 8px; padding: 8px 12px; transition: all 0.2s ease;">
                <i class="fas fa-users" style="font-size: 12px; color: #20c997;"></i>
                <span>Utilisateurs</span>
              </a>
            </li>
          </ul>
        </li>

      </ul>
    </nav>

    <!-- Footer Sidebar -->
    <div class="mt-auto p-3" style="border-top: 1px solid rgba(255,255,255,0.05);">
      <div class="d-flex align-items-center gap-2">
        <div style="width: 32px; height: 32px; background: rgba(255,255,255,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
          <i class="fas fa-info-circle" style="color: #6c757d; font-size: 14px;"></i>
        </div>
        <div>
          <small class="text-muted d-block">Version 1.0.0</small>
          <small class="text-muted" style="font-size: 10px;">© 2024 Akiba Yetu</small>
        </div>
      </div>
    </div>
  </div>
</aside>

<!-- Script pour gérer l'ouverture/fermeture des sous-menus -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Gestion des toggles des sous-menus
    const navLinks = document.querySelectorAll('.nav-sidebar .nav-link[data-toggle="collapse"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-target');
        const target = document.querySelector(targetId);
        const icon = this.querySelector('.fa-chevron-right, .fa-chevron-down');
        
        if (target) {
          if (target.classList.contains('show')) {
            target.classList.remove('show');
            if (icon) {
              icon.classList.remove('fa-chevron-down');
              icon.classList.add('fa-chevron-right');
            }
          } else {
            target.classList.add('show');
            if (icon) {
              icon.classList.remove('fa-chevron-right');
              icon.classList.add('fa-chevron-down');
            }
          }
        }
      });
    });
    
    // Détection de l'URL active pour surligner le menu correspondant
    const currentUrl = window.location.pathname;
    const menuItems = document.querySelectorAll('.nav-treeview .nav-link');
    
    menuItems.forEach(item => {
      if (item.getAttribute('href') === currentUrl) {
        item.style.background = 'linear-gradient(135deg, #20c997 0%, #198764 100%)';
        item.style.color = 'white';
        
        // Ouvrir le parent si fermé
        const parentCollapse = item.closest('.collapse');
        if (parentCollapse && !parentCollapse.classList.contains('show')) {
          parentCollapse.classList.add('show');
          const parentLink = document.querySelector(`[data-target="#${parentCollapse.id}"]`);
          if (parentLink) {
            const icon = parentLink.querySelector('.fa-chevron-right');
            if (icon) {
              icon.classList.remove('fa-chevron-right');
              icon.classList.add('fa-chevron-down');
            }
          }
        }
      }
    });
  });
</script>

<style>
  /* Style personnalisé pour le sidebar */
  .main-sidebar {
    transition: all 0.3s ease;
  }
  
  /* Style des liens du sidebar */
  .nav-sidebar .nav-link {
    color: #adb5bd;
    padding: 10px 12px;
    margin-bottom: 4px;
    transition: all 0.2s ease;
  }
  
  .nav-sidebar .nav-link:hover {
    background: rgba(32, 201, 151, 0.1);
    color: #20c997;
    transform: translateX(4px);
  }
  
  .nav-sidebar .nav-link.active {
    background: linear-gradient(135deg, #20c997 0%, #198764 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
  }
  
  /* Style des sous-menus */
  .nav-treeview {
    transition: all 0.2s ease;
  }
  
  .nav-treeview .nav-link {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .nav-treeview .nav-link:hover {
    background: rgba(32, 201, 151, 0.08);
    transform: translateX(2px);
  }
  
  /* Scrollbar personnalisée */
  .sidebar::-webkit-scrollbar {
    width: 4px;
  }
  
  .sidebar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  .sidebar::-webkit-scrollbar-thumb {
    background: #20c997;
    border-radius: 4px;
  }
  
  .sidebar::-webkit-scrollbar-thumb:hover {
    background: #198764;
  }
  
  /* Animation pour les sous-menus */
  .collapse {
    transition: all 0.2s ease;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .main-sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }
    
    .main-sidebar.show {
      transform: translateX(0);
    }
  }
</style>