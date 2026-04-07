<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
   <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CrediX</title>
    <link rel="icon" href="{{ asset('images/bigtontine.png') }}">
    <base href="/">
    {{-- <base href="/"> --}}
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">

    <!-- Google Font: Source Sans Pro -->
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="{{ asset('template/plugins/fontawesome-free/css/all.min.css') }}">
    <!-- Ionicons -->
    <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
    <!-- Tempusdominus Bootstrap 4 -->
    {{-- <link rel="stylesheet"
        href="{{ asset('template/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css') }}"> --}}
    <!-- iCheck -->
    <link rel="stylesheet" href="{{ asset('template/plugins/icheck-bootstrap/icheck-bootstrap.min.css') }}">
    <!-- JQVMap -->
    <link rel="stylesheet" href="{{ asset('template/plugins/jqvmap/jqvmap.min.css') }}">
    <!-- Theme style -->
    <link rel="stylesheet" href="{{ asset('template/dist/css/adminlte.min.css') }}">
    <!-- overlayScrollbars -->
    <link rel="stylesheet" href="{{ asset('template/plugins/overlayScrollbars/css/OverlayScrollbars.min.css') }}">
    <!-- Daterange picker -->
    <link rel="stylesheet" href="{{ asset('template/plugins/daterangepicker/daterangepicker.css') }}">
    <!-- summernote -->
    <link rel="stylesheet" href="{{ asset('template/plugins/summernote/summernote-bs4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">



    @viteReactRefresh
    @vite('resources/js/app.jsx')


    <style>
        .navbar-expand-lg ul li a {
            font-size: 14px !important;
            margin: -5px !important;
        }

        .navbar-expand-lg ul li a:hover {
            background: teal;
            color: #fff;
        }

        .navbar-expand-lg {
            background: #000 !important;
        }
    </style>
</head>

<body style="font-family:Tahoma !important; display: flex; flex-direction: column; min-height: 100vh; margin: 0;">
    {{-- <div class="header-section container-fluid">
    </div> --}}
    <!-- Navbar -->
<!-- Header principal amélioré -->
<nav class="main-header navbar navbar-expand navbar-light" style="background: teal; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-bottom: none;">
  <!-- Left navbar links -->
  <ul class="navbar-nav">
    <li class="nav-item">
      <a class="nav-link" data-widget="pushmenu" href="#" role="button" style="color: white; transition: all 0.2s ease;">
        <i class="fas fa-bars fa-lg"></i>
      </a>
    </li>
    <li class="nav-item d-none d-sm-inline-block">
      <a href="gestion_credit/home" class="nav-link" style="color: white; font-weight: 500; transition: all 0.2s ease;">
        <i class="fas fa-home me-1"></i>
        Accueil
      </a>
    </li>
  </ul>

  <!-- Right navbar links -->
  <ul class="navbar-nav ml-auto">
    <!-- Info utilisateur -->
    <li class="nav-item d-none d-sm-inline-block">
      <div class="d-flex align-items-center gap-2 me-2" style="background: rgba(255,255,255,0.15); padding: 6px 12px; border-radius: 30px;">
        <div style="width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <i class="fas fa-user-circle" style="color: white; font-size: 18px;"></i>
        </div>
        <div>
          <span style="color: white; font-weight: 600; font-size: 13px;">{{ auth()->user()->name }}</span>
          {{-- <span style="color: rgba(255,255,255,0.8); font-size: 11px; display: block; margin-top: -2px;">{{ auth()->user()->role }}</span> --}}
        </div>
      </div>
    </li>

    <!-- Dropdown menu -->
    <li class="nav-item dropdown">
      <a class="nav-link" data-toggle="dropdown" href="#" role="button" style="color: white; transition: all 0.2s ease;">
       <i class="fas fa-power-off"></i>
      </a>
      <div class="dropdown-menu dropdown-menu-md dropdown-menu-right" style="background: white; border: none; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); margin-top: 8px; padding: 8px 0;">
        @if (!auth()->user())
          <a href="{{ route('auth.login') }}" class="dropdown-item" style="padding: 10px 20px; transition: all 0.2s ease;">
            <i class="fas fa-sign-in-alt me-2" style="color: #20c997;"></i>
            Connexion
          </a>
          <div class="dropdown-divider" style="margin: 4px 0;"></div>
        @endif
        <a style="cursor: pointer; color: #dc3545;" class="dropdown-item" onclick="document.getElementById('logout-form').submit()">
          <i class="fas fa-sign-out-alt me-2"></i>
          Déconnexion
          <form action="{{ route('auth/logout') }}" method="POST" id="logout-form">@csrf</form>
        </a>
      </div>
    </li>
  </ul>
</nav>

<!-- Navigation secondaire améliorée -->
<nav class="navbar navbar-expand-lg navbar-dark" style="background: linear-gradient(135deg, #2c3e50 0%, #1a2632 100%); box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-top: 1px solid rgba(255,255,255,0.1);">
  <div class="container">
    <!-- Logo/Brand -->
    {{-- <a class="navbar-brand d-flex align-items-center gap-2" href="gestion_credit/home" style="font-weight: 700; letter-spacing: 0.5px;">
      <div style="width: 32px; height: 32px; background: rgba(32, 201, 151, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-left:70px">
        <i class="fas fa-chart-line" style="color: #20c997;"></i>
      </div>
      <span>Gestion Crédit</span>
    </a> --}}

    <!-- Bouton mobile -->
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation" style="border: none; background: rgba(255,255,255,0.1);">
      <span class="fa fa-bars"></span> Menu
    </button>

    <!-- Menu principal -->
    <div class="collapse navbar-collapse" id="ftco-nav">
      <ul class="navbar-nav mx-auto">
        <li class="nav-item active">
          <a href="gestion_credit/home" class="nav-link">
            <i class="fa fa-home me-1"></i>Home
          </a>
        </li>
        <li class="nav-item">
          <a href="{{ route('gestion_credit.pages.montage-credit') }}" class="nav-link d-flex align-items-center gap-2" style="transition: all 0.2s ease;">
            <i class="fas fa-plus-circle" style="font-size: 14px;"></i>
            <span>Nouveau dossier</span>
          </a>
        </li>

        <li class="nav-item">
          <a href="{{ route('gestion_credit.pages.validation-credit') }}" class="nav-link d-flex align-items-center gap-2" style="transition: all 0.2s ease;">
            <i class="fas fa-check-circle" style="font-size: 14px;"></i>
            <span>Suivi dossier</span>
          </a>
        </li>

        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="transition: all 0.2s ease;">
            <i class="fas fa-chart-bar" style="font-size: 14px;"></i>
            <span>Rapport</span>
          </a>
          <div class="dropdown-menu" aria-labelledby="dropdown04" style="border: none; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); margin-top: 4px;">
            <a class="dropdown-item d-flex align-items-center gap-2" href="{{ route('gestion_credit.pages.credit-decaisse') }}" style="padding: 10px 20px; transition: all 0.2s ease;">
              <i class="fas fa-money-bill-wave" style="color: #20c997;"></i>
              <span>Crédits décaissés</span>
            </a>

             <a class="dropdown-item d-flex align-items-center gap-2" href="{{ route('gestion_credit.pages.rapport-credit') }}" style="padding: 10px 20px; transition: all 0.2s ease;">
              <i class="fas fa-chart-line fa-3x opacity-75" style="color: #20c997; font-size:13px"></i>
              <span>Autres rapport</span>
            </a>
          </div>
        </li>
      </ul>

      <!-- Optionnel: barre de recherche compacte -->
      {{-- <div class="d-none d-lg-block">
        <div class="position-relative">
          <i class="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style="font-size: 12px;"></i>
          <input type="text" class="form-control form-control-sm" placeholder="Rechercher..." style="border-radius: 30px; padding: 6px 12px 6px 32px; width: 200px; border: none; background: rgba(255,255,255,0.1); color: white;">
        </div>
      </div> --}}
    </div>
  </div>
</nav>

<!-- Style CSS additionnel -->
<style>
  /* Animation pour les liens */
  .nav-link {
    position: relative;
    transition: all 0.2s ease;
  }
  
  .nav-link:hover {
    transform: translateY(-1px);
    color: #20c997 !important;
  }
  
  /* Style pour les dropdown items */
  .dropdown-item {
    transition: all 0.2s ease;
  }
  
  .dropdown-item:hover {
    background-color: rgba(32, 201, 151, 0.1);
    transform: translateX(4px);
  }
  
  /* Style pour le bouton mobile */
  .navbar-toggler:focus {
    outline: none;
    box-shadow: none;
  }
  
  /* Animation pour le menu mobile */
  .navbar-collapse {
    transition: all 0.3s ease;
  }
  
  /* Style pour les icônes */
  .nav-link i {
    transition: transform 0.2s ease;
  }
  
  .nav-link:hover i {
    transform: translateY(-2px);
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .navbar-nav {
      margin-top: 16px;
    }
    
    .nav-item {
      margin: 4px 0;
    }
    
    .dropdown-menu {
      background: rgba(44, 62, 80, 0.95) !important;
    }
    
    .dropdown-item {
      color: white !important;
    }
  }
</style>
    <!-- /.navbar -->
    <div class="d-flex flex-column min-vh-100">
        <!-- Contenu principal -->
        <main style="flex: 1;">
            <!-- Insérez ici le contenu principal de votre page -->
