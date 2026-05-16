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

        :root {
            --primary-color: #20c997;
            --primary-dark: #198764;
            --secondary-color: #138496;
            --dark-bg: #0a0a0a;
            --light-bg: #f8f9fa;
        }

        /* Styles généraux */
        body {
            font-family: 'Source Sans Pro', 'Tahoma', sans-serif !important;
            background-color: var(--light-bg);
        }

        /* Header principal amélioré */
        .main-header {
            background: #138496;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            border-bottom: 1px solid rgba(32, 201, 151, 0.3);
        }

        .main-header .nav-link {
            color: rgba(255, 255, 255, 0.9) !important;
            transition: all 0.3s ease;
            border-radius: 8px;
            margin: 0 2px;
        }

        .main-header .nav-link:hover {
            color: var(--primary-color) !important;
            background: rgba(32, 201, 151, 0.15);
            transform: translateY(-1px);
        }

        /* Navigation secondaire moderne avec menu centré */
        .navbar-modern {
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            border-bottom: 2px solid var(--primary-color);
            position: sticky;
            top: 0;
            z-index: 1020;
        }

        .navbar-modern .navbar-brand {
            font-weight: bold;
            font-size: 1.5rem;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            transition: all 0.3s ease;
        }

        .navbar-modern .navbar-brand:hover {
            transform: scale(1.05);
        }

        /* Menu centré */
        .navbar-modern .navbar-nav {
            margin: 0 auto;
        }

        .navbar-modern .nav-link {
            color: rgba(255, 255, 255, 0.85) !important;
            font-weight: 500;
            font-size: 0.85rem;
            padding: 0.75rem 1rem !important;
            transition: all 0.3s ease;
            position: relative;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .navbar-modern .nav-link:hover {
            color: var(--primary-color) !important;
            background: rgba(32, 201, 151, 0.1);
            transform: translateY(-2px);
        }

        .navbar-modern .nav-link.active {
            color: var(--primary-color) !important;
        }

        .navbar-modern .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            transform: translateX(-50%);
            width: 60%;
            height: 3px;
            background: var(--primary-color);
            border-radius: 3px;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from {
                width: 0;
                opacity: 0;
            }

            to {
                width: 60%;
                opacity: 1;
            }
        }


        /* Dropdown moderne */
        .dropdown-menu-modern {
            border: none;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            padding: 0.5rem 0;
            margin-top: 0.5rem;
            animation: fadeInDown 0.3s ease;
            background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
            border: 1px solid rgba(32, 201, 151, 0.2);
        }

        .dropdown-menu-modern .dropdown-item {
            padding: 0.6rem 1.5rem;
            font-size: 0.85rem;
            transition: all 0.2s ease;
            color: rgba(255, 255, 255, 0.85);
        }

        .dropdown-menu-modern .dropdown-item:hover {
            background: linear-gradient(90deg, rgba(32, 201, 151, 0.15), transparent);
            color: var(--primary-color);
            padding-left: 1.8rem;
        }

        .dropdown-menu-modern .dropdown-header {
            color: var(--primary-color);
            font-weight: bold;
            border-bottom: 1px solid rgba(32, 201, 151, 0.2);
            margin-bottom: 5px;
        }

        /* Bouton menu mobile */
        .navbar-toggler-modern {
            border: none;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            color: white;
            padding: 0.5rem 1.2rem;
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .navbar-toggler-modern:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(32, 201, 151, 0.4);
        }

        /* Animation */
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-15px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Logo et marque */
        .brand-wrapper {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .brand-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
            transition: all 0.3s ease;
        }

        .brand-icon:hover {
            transform: rotate(5deg) scale(1.05);
        }

        .brand-icon i {
            font-size: 20px;
            color: white;
        }

        /* Responsive */
        @media (max-width: 991.98px) {
            .navbar-modern .navbar-collapse {
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                border-radius: 16px;
                padding: 1rem;
                margin-top: 1rem;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(32, 201, 151, 0.2);
            }

            .navbar-modern .navbar-nav {
                margin: 0;
            }

            .navbar-modern .nav-link {
                padding: 0.75rem !important;
                border-radius: 10px;
                text-align: center;
            }

            .navbar-modern .nav-link.active::after {
                display: none;
            }

            .navbar-modern .nav-link.active {
                background: linear-gradient(90deg, rgba(32, 201, 151, 0.2), transparent);
            }

            .dropdown-menu-modern {
                background: rgba(26, 26, 26, 0.95);
                margin-left: 15px;
            }
        }

        @media (max-width: 768px) {
            .main-header .nav-link {
                padding: 0.5rem 0.75rem;
                font-size: 0.85rem;
            }

            .navbar-modern .navbar-brand {
                font-size: 1.2rem;
            }

            .brand-icon {
                width: 32px;
                height: 32px;
            }

            .brand-icon i {
                font-size: 16px;
            }
        }

        /* Badge notifications */
        .badge-notification {
            position: relative;
        }

        .badge-notification::after {
            content: '';
            position: absolute;
            top: 5px;
            right: 5px;
            width: 8px;
            height: 8px;
            background: #ff4757;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% {
                transform: scale(1);
                opacity: 1;
            }

            50% {
                transform: scale(1.2);
                opacity: 0.7;
            }

            100% {
                transform: scale(1);
                opacity: 1;
            }
        }

        /* Effet de brillance au survol des dropdown */
        .dropdown-toggle::after {
            transition: transform 0.3s ease;
        }

        .dropdown-toggle:hover::after {
            transform: rotate(180deg);
        }

        .btn-teal {
            background-color: #20c997;
            border-color: #20c997;
            color: white;
        }

        .btn-teal:hover {
            background-color: #198764;
            border-color: #198764;
        }






        /* Sous-menu horizontal ou vertical */
.dropdown-submenu {
    position: relative;
}

.dropdown-submenu .dropdown-menu-sub {
    top: 0;
    left: 100%;
    margin-top: -5px;
    margin-left: 5px;
    background: #0d0d0d;
    border-radius: 12px;
    border: none;
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    min-width: 220px;
}

.dropdown-submenu:hover .dropdown-menu-sub {
    display: block;
}

/* Pour mobile : empiler */
@media (max-width: 991.98px) {
    .dropdown-submenu .dropdown-menu-sub {
        position: static;
        margin-left: 15px;
        margin-top: 5px;
        box-shadow: none;
        background: rgba(255,255,255,0.05);
    }
    .dropdown-submenu .dropdown-toggle::after {
        content: "\f078"; /* fontawesome down arrow */
        font-family: "Font Awesome 6 Free";
        font-weight: 900;
        border: none;
        margin-left: auto;
    }
}
    </style>
</head>

<body style="font-family:Tahoma !important; display: flex; flex-direction: column; min-height: 100vh; margin: 0;">
    {{-- <div class="header-section container-fluid">
    </div> --}}
    <!-- Navbar -->
    <!-- Header principal amélioré -->
    <nav class="main-header navbar navbar-expand navbar-light"
        style="background: teal; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-bottom: none;">
        <!-- Left navbar links -->
        <ul class="navbar-nav d-flex w-100">
            <li class="nav-item">
                <a class="nav-link" data-widget="pushmenu" href="#" role="button"
                    style="color: white; transition: all 0.2s ease;">
                    <i class="fas fa-bars fa-lg"></i>
                </a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
                <a href="gestion_credit/home" class="nav-link"
                    style="color: white; font-weight: 500; transition: all 0.2s ease;">
                    <i class="fas fa-home me-1"></i>
                    Accueil
                </a>
            </li>

            <!-- ========== SÉLECTEUR D'AGENCE MODERNE ========== -->
            @php
                $userAgences = session('user_agences', []);
                $currentAgence = session('current_agence');
            @endphp

            @if (count($userAgences) > 1)
                <li class="nav-item dropdown ms-auto">
                    <a class="nav-link dropdown-toggle" href="#" id="agenceDropdown" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">

                        @if ($currentAgence)
                            @if ($currentAgence['id'] === 'all')
                                🌍 Toutes les Agences
                            @else
                                <i class="fas fa-building me-1"></i>
                                AGENCE DE {{ $currentAgence['nom_agence'] ?? '' }} -
                                {{ $currentAgence['code_agence'] ?? '' }}
                            @endif
                        @else
                            Agence
                        @endif
                    </a>
                    <div class="dropdown-menu dropdown-menu-modern p-3" aria-labelledby="agenceDropdown"
                        style="min-width: 280px;">
                        <div class="form-group mb-2">
                            <label class="small text-muted mb-1">Sélectionnez votre agence</label>
                            <select id="agenceSelect" class="form-control form-control-sm">
                                {{-- Option "Toutes les agences" --}}
                                <option value="all" data-code="all" data-nom="Toutes les agences"
                                    @if ($currentAgence && $currentAgence['id'] == 'all') selected @endif>
                                    🌍 Toutes les agences
                                </option>

                                {{-- Agences réelles de l'utilisateur --}}
                                @foreach ($userAgences as $agence)
                                    <option value="{{ $agence['id'] }}" data-code="{{ $agence['code_agence'] }}"
                                        data-nom="{{ $agence['nom_agence'] }}"
                                        @if ($currentAgence && $currentAgence['id'] == $agence['id']) selected @endif>
                                        {{ $agence['code_agence'] }} - {{ $agence['nom_agence'] }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                        <button id="btnConnectAgence" class="btn btn-teal btn-sm w-100">
                            <i class="fas fa-plug me-1"></i> Se connecter
                        </button>
                    </div>
                </li>
            @elseif(count($userAgences) == 1)
                <li class="nav-item ms-auto">
                    <span class="nav-link text-white-50">
                        <i class="fas fa-building me-1"></i> AGENCE DE {{ $userAgences[0]['nom_agence'] }}
                        -{{ $userAgences[0]['code_agence'] }}
                    </span>
                </li>
            @endif
        </ul>

        <!-- Right navbar links -->
        <ul class="navbar-nav ml-auto">
            <!-- Info utilisateur -->
            <li class="nav-item d-none d-sm-inline-block">
                <div class="d-flex align-items-center gap-2 me-2"
                    style="background: rgba(255,255,255,0.15); padding: 6px 12px; border-radius: 30px;">
                    <div
                        style="width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-user-circle" style="color: white; font-size: 18px;"></i>
                    </div>
                    <div>
                        <span
                            style="color: white; font-weight: 600; font-size: 13px;">{{ auth()->user()->name }}</span>
                        {{-- <span style="color: rgba(255,255,255,0.8); font-size: 11px; display: block; margin-top: -2px;">{{ auth()->user()->role }}</span> --}}
                    </div>
                </div>
            </li>

            <!-- Dropdown menu -->
            <li class="nav-item dropdown">
                <a class="nav-link" data-toggle="dropdown" href="#" role="button"
                    style="color: white; transition: all 0.2s ease;">
                    <i class="fas fa-power-off"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-md dropdown-menu-right"
                    style="background: white; border: none; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); margin-top: 8px; padding: 8px 0;">
                    @if (!auth()->user())
                        <a href="{{ route('auth.login') }}" class="dropdown-item"
                            style="padding: 10px 20px; transition: all 0.2s ease;">
                            <i class="fas fa-sign-in-alt me-2" style="color: #20c997;"></i>
                            Connexion
                        </a>
                        <div class="dropdown-divider" style="margin: 4px 0;"></div>
                    @endif
                    <a style="cursor: pointer; color: #dc3545;" class="dropdown-item"
                        onclick="document.getElementById('logout-form').submit()">
                        <i class="fas fa-sign-out-alt me-2"></i>
                        Déconnexion
                        <form action="{{ route('auth/logout') }}" method="POST" id="logout-form">@csrf</form>
                    </a>
                </div>
            </li>
        </ul>
    </nav>

    <!-- Navigation secondaire améliorée -->
    <nav class="navbar navbar-expand-lg navbar-dark"
        style="background: linear-gradient(135deg, #2c3e50 0%, #1a2632 100%); box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-top: 1px solid rgba(255,255,255,0.1);">
        <div class="container">
            <!-- Logo/Brand -->
            {{-- <a class="navbar-brand d-flex align-items-center gap-2" href="gestion_credit/home" style="font-weight: 700; letter-spacing: 0.5px;">
      <div style="width: 32px; height: 32px; background: rgba(32, 201, 151, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-left:70px">
        <i class="fas fa-chart-line" style="color: #20c997;"></i>
      </div>
      <span>Gestion Crédit</span>
    </a> --}}

            <!-- Bouton mobile -->
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav"
                aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation"
                style="border: none; background: rgba(255,255,255,0.1);">
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
                        <a href="{{ route('gestion_credit.pages.montage-credit') }}"
                            class="nav-link d-flex align-items-center gap-2" style="transition: all 0.2s ease;">
                            <i class="fas fa-plus-circle" style="font-size: 14px;"></i>
                            <span>Nouveau dossier</span>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a href="{{ route('gestion_credit.pages.validation-credit') }}"
                            class="nav-link d-flex align-items-center gap-2" style="transition: all 0.2s ease;">
                            <i class="fas fa-check-circle" style="font-size: 14px;"></i>
                            <span>Suivi dossier</span>
                        </a>
                    </li>

                    <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fas fa-chart-bar"></i>
        <span>Rapport</span>
    </a>

    <div class="dropdown-menu dropdown-menu-modern" aria-labelledby="dropdown04">
        <!-- Décaissés -->
        <a class="dropdown-item d-flex align-items-center gap-2" href="{{ route('gestion_credit.pages.credit-decaisse') }}">
            <i class="fas fa-money-bill-wave text-success fa-fw"></i>
            Crédits décaissés
        </a>

        <!-- En attente -->
        <a class="dropdown-item d-flex align-items-center gap-2" href="{{ route('gestion_credit.pages.credit-encours-decaisss') }}">
            <i class="fas fa-coins text-warning fa-fw"></i>
            Crédits en attente de décaissement
        </a>

        <div class="dropdown-divider"></div>

        <!-- Sous-menu pour rapports avancés -->
        <div class="dropdown-submenu dropstart">
            <a class="dropdown-item dropdown-toggle d-flex align-items-center gap-2" href="#">
                <i class="fas fa-chart-line text-info fa-fw"></i>
                Analyses avancées
            </a>
            <ul class="dropdown-menu dropdown-menu-sub">
                <li>
                    <a class="dropdown-item" href="{{ route('gestion_credit.pages.rapport-credit') }}">
                        <i class="fas fa-table me-2"></i> Rapport des crédits
                    </a>
                </li>
                <li>
                    <a class="dropdown-item" href="{{ route('gestion_credit.pages.rapport-credit2') }}">
                        <i class="fas fa-chart-pie me-2"></i>Autres rapport des crédits
                    </a>
                </li>
            </ul>
        </div>
    </div>
</li>

                    <style>
                        .menu-item {
                            padding: 10px 20px;
                            transition: all 0.25s ease;
                            border-radius: 8px;
                            margin: 2px 8px;
                        }

                        .menu-item:hover {
                            background: rgba(255, 255, 255, 0.08);
                            transform: translateX(4px);
                        }
                    </style>
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

            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const btnConnect = document.getElementById('btnConnectAgence');
                    if (btnConnect) {
                        btnConnect.addEventListener('click', function() {
                            const select = document.getElementById('agenceSelect');
                            const selectedOption = select.options[select.selectedIndex];
                            const agenceId = select.value;
                            const agenceCode = selectedOption.getAttribute('data-code');
                            const agenceNom = selectedOption.getAttribute('data-nom');

                            // Requête AJAX pour changer l'agence active en session
                            fetch('{{ route('eco.agence.change') }}', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                                    },
                                    body: JSON.stringify({
                                        agence_id: agenceId,
                                        agence_code: agenceCode,
                                        agence_nom: agenceNom
                                    })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.status === 1) {
                                        // Recharger la page pour appliquer le changement d'agence
                                        window.location.reload();
                                    } else {
                                        alert('Erreur : ' + (data.msg || 'Impossible de changer d\'agence'));
                                    }
                                })
                                .catch(error => {
                                    console.error('Erreur:', error);
                                    alert('Une erreur est survenue');
                                });
                        });
                    }
                });


                // Empêcher la fermeture du dropdown agence quand on clique sur le select ou le bouton
                document.addEventListener('DOMContentLoaded', function() {
                    var agenceDropdown = document.getElementById('agenceDropdown');
                    if (agenceDropdown) {
                        var dropdownMenu = agenceDropdown.nextElementSibling;
                        if (dropdownMenu) {
                            dropdownMenu.addEventListener('click', function(event) {
                                event.stopPropagation(); // Empêche la fermeture du dropdown
                            });
                        }
                    }
                });
            </script>
            <!-- Insérez ici le contenu principal de votre page -->
