<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>EpargnePro</title>
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
    <link rel="stylesheet"
        href="{{ asset('template/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css') }}">
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

<body style="font-family:Tahoma !important;">
    {{-- <div class="header-section container-fluid">
    </div> --}}
    <!-- Navbar -->
    <nav class="main-header navbar navbar-expand navbar-white navbar-light" style="background: teal">
        <!-- Left navbar links -->
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
                <a href="eco/home" class="nav-link">Home</a>
            </li>

            {{-- <li class="nav-item d-none d-sm-inline-block">
                <a href="#" class="nav-link">Contact</a>
            </li> --}}
        </ul>

        <!-- Right navbar links -->
        <ul class="navbar-nav ml-auto">
            <!-- Navbar Search -->
            <li class="nav-item">
                {{-- <a class="nav-link" data-widget="navbar-search" href="#" role="button">
                    <i class="fas fa-search"></i>
                </a> --}}
                <div class="navbar-search-block">
                    {{-- <form class="form-inline">
                        <div class="input-group input-group-sm">
                            <input class="form-control form-control-navbar" type="search" placeholder="Search"
                                aria-label="Search">
                            <div class="input-group-append">
                                <button class="btn btn-navbar" type="submit">
                                    <i class="fas fa-search"></i>
                                </button>
                                <button class="btn btn-navbar" type="button" data-widget="navbar-search">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </form> --}}
                </div>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
                <a style="pointer-events: none" href="" class="nav-link">{{ auth()->user()->name }}</a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link" data-toggle="dropdown" href="#">
                    <i class="fas fa-th-large"></i>
                    {{-- <span class="badge badge-warning navbar-badge">15</span> --}}
                </a>
                <div class="dropdown-menu dropdown-menu-md dropdown-menu-right" style="background: teal">
                    {{-- <span class="dropdown-item dropdown-header"></span> --}}
                    {{-- <div class="dropdown-divider"></div> --}}
                    @if (!auth()->user())
                        <a href="{{ route('auth.login') }}" class="dropdown-item">
                            Login
                        </a>
                        <div class="dropdown-divider"></div>
                    @endif

                    {{-- <a href="{{ route('auth.register') }}" class="dropdown-item">
                        Register
                    </a>
                    <div class="dropdown-divider"></div> --}}
                    <a style="cursor: pointer" class="login_link dropdown-item"
                        onclick="document.getElementById('logout-form').submit()">
                        Déconnexion <i class="fa fa-sign-out" aria-hidden="true"></i>
                        <form action="{{ route('auth/logout') }}" method="POST" id="logout-form">@csrf
                        </form>
                    </a>
                </div>

            </li>
            {{-- <li class="nav-item">
                <a class="nav-link" data-widget="fullscreen" href="#" role="button">
                    <i class="fas fa-expand-arrows-alt"></i>
                </a>
            </li> --}}
        </ul>
    </nav>

    <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
        <div class="container">
            {{-- <a class="navbar-brand" href="home">ECONOMISONS</a> --}}
            {{-- <form action="#" class="searchform order-sm-start order-lg-last">
                <div class="form-group d-flex">
                    <input type="text" class="form-control pl-3" placeholder="Search">
                    <button type="submit" placeholder="" class="form-control search"><span
                            class="fa fa-search"></span></button>
                </div>
            </form> --}}
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav"
                aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="fa fa-bars"></span> Menu
            </button>
            <div class="collapse navbar-collapse text-center" id="ftco-nav">
                <ul class="navbar-nav m-auto">
                    <li class="nav-item active"><a href="eco/home" class="nav-link">Home</a></li>
                    @if ($isCaissier)
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="dropdown04" data-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false">Caisse</a>
                            <div class="dropdown-menu" aria-labelledby="dropdown04">
                                <a class="dropdown-item" href="{{ route('eco.pages.depot-espece') }}">Dépot</a>
                                <a class="dropdown-item" href="{{ route('eco.pages.retrait-espece') }}">Rétrait</a>
                                <a class="dropdown-item" href="{{ route('eco.pages.visa') }}">Positionnement</a>

                                <a class="dropdown-item" href="{{ route('eco.pages.appro') }}">Appro</a>
                                <a class="dropdown-item" href="{{ route('eco.pages.delestage') }}">Délestage</a>
                                <a class="dropdown-item" href="{{ route('eco.pages.entreeT') }}">Entrée T</a>
                            </div>
                        </li>
                    @endif
                    @if ($isAgentCredit)
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="dropdown04"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Crédit</a>
                            <div class="dropdown-menu" aria-labelledby="dropdown04">
                                <a class="dropdown-item" href="{{ route('eco.pages.montage-credit') }}">Montage
                                    crédit</a>
                                <a class="dropdown-item"
                                    href="{{ route('eco.pages.rapport-credit') }}">Echeancier</a>
                                <a class="dropdown-item" href="{{ route('eco.pages.rapport-credit') }}">Tableau
                                    d'Ammortisement</a>
                                {{-- <a class="dropdown-item" href="">Crédits En cours</a>
                            <a class="dropdown-item" href="">Crédits cloturés</a> --}}
                                <a class="dropdown-item" href="{{ route('eco.pages.rapport-credit') }}">Balance
                                    agée</a>

                                {{-- <a class="dropdown-item" href="#">Page 3</a>
                            <a class="dropdown-item" href="#">Page 4</a> --}}
                            </div>
                        </li>
                    @endif
                    @if ($isAgentClientele)
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="dropdown04"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Clientèle</a>
                            <div class="dropdown-menu" aria-labelledby="dropdown04">
                                <a class="dropdown-item" href="{{ route('eco.pages.adhesion-membre') }}">Adhésion
                                    membre</a>
                                <a class="dropdown-item" href="{{ route('eco.pages.releve') }}">Rélevé de compte</a>
                                <a class="dropdown-item" href="{{ route('eco.pages.sommaire-compte') }}">Sommaire de
                                    compte</a>
                                {{-- <a class="dropdown-item" href="#">Page 3</a>
                            <a class="dropdown-item" href="#">Page 4</a> --}}
                            </div>
                        </li>
                    @endif

                    @if ($isCaissier)
                        <li class="nav-item"><a href="{{ route('eco.pages.delestage') }}"
                                class="nav-link">Délestage</a>
                        </li>
                    @endif
                    @if ($isChefCaisse)
                        <li class="nav-item"><a href="{{ route('eco.pages.entreeT') }}" class="nav-link">Entrée
                                T</a>

                        </li>
                        <li class="nav-item"><a href="{{ route('eco.pages.appro') }}" class="nav-link">Appro
                            </a>

                        </li>
                    @endif
                    <li class="nav-item"><a href="{{ route('eco.pages.releve') }}" class="nav-link">Relevé</a>
                    </li>
                    <li class="nav-item"><a style="color:red" href="{{ route('eco.pages.remboursement-attendu') }}"
                            class="nav-link">Rembours. attendus</a>
                    </li>
                    <li class="nav-item"><a href="{{ route('eco.pages.sms-banking') }}" class="nav-link">SMS
                            Banking</a>
                    </li>



                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="dropdown04" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">Rapport</a>
                        <div class="dropdown-menu" aria-labelledby="dropdown04">
                            <a class="dropdown-item" href="{{ route('eco.pages.balance') }}">Balance</a>
                            <a class="dropdown-item" href="{{ route('eco.pages.bilan') }}">Bilan</a>
                            {{-- <a class="dropdown-item" href="">Grand livre</a> --}}
                            <a class="dropdown-item" href="{{ route('eco.pages.tfr') }}">TFR</a>
                            <a class="dropdown-item" href="{{ route('eco.pages.releve') }}">Rélevé</a>
                            <a class="dropdown-item" href="{{ route('eco.pages.rapport-credit') }}">Rapport
                                crédit</a>
                            <a class="dropdown-item" href="{{ route('eco.pages.journal') }}">Journal</a>
                            <a class="dropdown-item" href="{{ route('eco.pages.repertoire') }}">Repertoire C</a>
                            <a class="dropdown-item"
                                href="{{ route('eco.pages.remboursement-attendu') }}">Remboursement
                                attendu</a>
                            <a class="dropdown-item" href="{{ route('eco.pages.sommaire-compte') }}">Sommaire de
                                compte</a>

                        </div>
                    </li>

                </ul>
            </div>
        </div>
    </nav>
    <!-- /.navbar -->
    <div class="d-flex flex-column min-vh-100">
        <!-- Contenu principal -->
        <main class="flex-grow-1">
            <!-- Insérez ici le contenu principal de votre page -->
