 <!-- Main Sidebar Container -->
 <aside class="main-sidebar sidebar-dark-primary elevation-4" style="background: #000;position:fixed">

     <!-- Sidebar -->
     <div class="sidebar">
         <!-- Sidebar user panel (optional) height:130vh !important-->
         <div class="user-panel mt-3 pb-3 mb-3 d-flex">
             {{-- <div class="image">
                 <a href="eco/home"> <img src="{{ asset('uploads/images/logo/1696413083.jpg') }}"
                         style="width: 100%;height:18px;" class="elevation-2" alt=""></a>
             </div> --}}
             <div class="info">
                 <a href="eco/home" class="d-block text-light"
                     style="font-size: 22px;margin-top:-10px"><strong>EpargnePro</strong></a>
             </div>
         </div>
         <nav class="mt-2">
             <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu"
                 data-accordion="false">
                 <li class="nav-item menu-open">

                     <ul class="nav nav-treeview">
                         @if ($isCaissier)
                             <li class="nav-item">
                                 <a href="#" class="nav-link">
                                     <i class="fas fa-tasks"></i>
                                     <p>
                                         CAISSE
                                         <i class="right fas fa-angle-left"></i>
                                     </p>
                                 </a>
                                 <ul class="nav nav-treeview">
                                     <li class="nav-item">
                                         <a href="{{ route('eco.pages.depot-espece') }}" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Dépot</p>
                                         </a>
                                     </li>
                                     <li class="nav-item">
                                         <a href="{{ route('eco.pages.visa') }}" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Visa</p>
                                         </a>
                                     </li>
                                     <li class="nav-item">
                                         <a href="{{ route('eco.pages.retrait-espece') }}" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Retrait</p>
                                         </a>
                                     </li>
                                     {{-- <li class="nav-item">
                                     <a href="" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Virement</p>
                                     </a>
                                 </li> --}}
                                     {{-- <li class="nav-item">
                                         <a href="" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Conversion</p>
                                         </a>
                                     </li> --}}
                                     <li class="nav-item">
                                         <a href="{{ route('eco.pages.delestage') }}" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Délestage</p>
                                         </a>
                                     </li>
                                     <li class="nav-item">
                                         <a href="{{ route('eco.pages.repertoire') }}" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Repertoire</p>
                                         </a>
                                     </li>
                                     <li class="nav-item">
                                         <a href="{{ route('eco.pages.releve') }}" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Relevé</p>
                                         </a>
                                     </li>
                                     <li class="nav-item">
                                         <a href="{{ route('eco.pages.appro') }}" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Appro</p>
                                         </a>
                                     </li>
                                     <li class="nav-item">
                                         <a href="{{ route('eco.pages.suspens') }}" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Suspens</p>
                                         </a>
                                     </li>
                                     <li class="nav-item">
                                         <a href="#" class="nav-link">
                                             <i class="fas fa-tasks"></i>
                                             <p>
                                                 Trésorerie
                                                 <i class="right fas fa-angle-left"></i>
                                             </p>
                                         </a>
                                         <ul class="nav nav-treeview">
                                             <li class="nav-item">
                                                 <a href="{{ route('eco.pages.appro') }}" class="nav-link">
                                                     <i class="far fa-circle nav-icon"></i>
                                                     <p>Appro</p>
                                                 </a>
                                             </li>
                                             <li class="nav-item">
                                                 <a href="{{ route('eco.pages.entreeT') }}" class="nav-link">
                                                     <i class="far fa-circle nav-icon"></i>
                                                     <p>Entrée T</p>
                                                 </a>
                                             </li>

                                             {{-- <li class="nav-item">
                                             <a href="#" class="nav-link">
                                                 <i class="far fa-circle nav-icon"></i>
                                                 <p>
                                                     Entrée T
                                                     <i class="right fas fa-angle-left"></i>
                                                 </p>
                                             </a>
                                             <ul class="nav nav-treeview">
                                                 <li class="nav-item">
                                                     <a href="#" class="nav-link">
                                                         <i class="far fa-dot-circle nav-icon"></i>
                                                         <p>Level 3</p>
                                                     </a>
                                                 </li>
                                                 <li class="nav-item">
                                                     <a href="#" class="nav-link">
                                                         <i class="far fa-dot-circle nav-icon"></i>
                                                         <p>Level 3</p>
                                                     </a>
                                                 </li>
                                                 <li class="nav-item">
                                                     <a href="#" class="nav-link">
                                                         <i class="far fa-dot-circle nav-icon"></i>
                                                         <p>Level 3</p>
                                                     </a>
                                                 </li>
                                             </ul>
                                         </li>
                                         <li class="nav-item">
                                             <a href="#" class="nav-link">
                                                 <i class="far fa-circle nav-icon"></i>
                                                 <p>Level 2</p>
                                             </a>
                                         </li> --}}
                                         </ul>
                                     </li>
                                 </ul>
                             </li>
                         @endif
                         @if ($isComptable)
                             <li class="nav-item">
                                 <a href="#" class="nav-link">
                                     <i class="fas fa-tasks"></i>
                                     <p>
                                         COMPTABILITE
                                         <i class="right fas fa-angle-left"></i>
                                     </p>
                                 </a>
                                 <ul class="nav nav-treeview">
                                     <li class="nav-item">
                                         <a href="{{ route('eco.pages.debiter') }}" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Débiter</p>
                                         </a>
                                     </li>
                                     <li class="nav-item">
                                         <a href="{{ route('eco.pages.crediter') }}" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Créditer</p>
                                         </a>
                                     </li>
                                 </ul>
                             </li>
                         @endif
                         @if ($isAgentCredit)
                             <li class="nav-item">
                                 <a href="#" class="nav-link">
                                     <i class="fas fa-tasks"></i>
                                     <p>
                                         GESTION CREDIT
                                         <i class="right fas fa-angle-left"></i>
                                     </p>
                                 </a>
                                 <ul class="nav nav-treeview">
                                     <li class="nav-item">
                                         <a href="{{ route('eco.pages.montage-credit') }}" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Montage crédit</p>
                                         </a>
                                     </li>
                                     <li class="nav-item">
                                         <a href="{{ route('eco.pages.type-credit') }}" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Type de crédit</p>
                                         </a>
                                     </li>
                                 </ul>
                             </li>
                         @endif
                         @if ($isAgentClientele)
                             <li class="nav-item">
                                 <a href="#" class="nav-link">
                                     <i class="fas fa-tasks"></i>
                                     <p>
                                         CLIENTELLE
                                         <i class="fas fa-angle-left right"></i>
                                     </p>
                                 </a>
                                 <ul class="nav nav-treeview">
                                     <li class="nav-item">
                                         <a href="{{ route('eco.pages.adhesion-membre') }}" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Adhésion</p>
                                         </a>
                                     </li>
                                     {{-- <li class="nav-item">
                                     <a href="" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Icons</p>
                                     </a>
                                 </li> --}}

                                 </ul>
                             </li>
                         @endif
                         <li class="nav-item">
                             <a href="#" class="nav-link">
                                 <i class="fas fa-tasks"></i>
                                 <p>
                                     RAPPORT
                                     <i class="fas fa-angle-left right"></i>
                                 </p>
                             </a>
                             <ul class="nav nav-treeview">
                                 <li class="nav-item">
                                     <a href="{{ route('eco.pages.journal') }}" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Journal</p>
                                     </a>
                                 </li>
                                 <li class="nav-item">
                                     <a href="{{ route('eco.pages.repertoire') }}" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Repertoire</p>
                                     </a>
                                 </li>
                                 <li class="nav-item">
                                     <a href="{{ route('eco.pages.releve') }}" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Relevé de compte</p>
                                     </a>
                                 </li>
                                 <li class="nav-item">
                                     <a href="{{ route('eco.pages.balance') }}" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Balance</p>
                                     </a>
                                 </li>
                                 <li class="nav-item">
                                     <a href="{{ route('eco.pages.bilan') }}" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Bilan</p>
                                     </a>
                                 </li>
                                 <li class="nav-item">
                                     <a href="{{ route('eco.pages.tfr') }}" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>TFR</p>
                                     </a>
                                 </li>

                             </ul>
                         </li>

                         <li class="nav-item">
                             <a href="#" class="nav-link">
                                 <i class="fas fa-tasks"></i>
                                 <p>
                                     Admnistration
                                     <i class="fas fa-angle-left right"></i>
                                 </p>
                             </a>
                             <ul class="nav nav-treeview">
                                 <li class="nav-item">
                                     <a href="{{ route('eco.pages.cloture') }}" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Clôture & Ouverture</p>
                                     </a>
                                 </li>

                             </ul>
                         </li>
                         <li class="nav-header">----------------------------------</li>
                         @if ($isIT)
                             <li class="nav-item">
                                 <a href="#" class="nav-link">
                                     <i class="fas fa-tasks"></i>
                                     <p>
                                         Paramètre
                                         <i class="fas fa-angle-left right"></i>
                                     </p>
                                 </a>
                                 <ul class="nav nav-treeview">
                                     <li class="nav-item">
                                         <a href="{{ route('eco.pages.utilisateurs') }}" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Utilisateurs</p>
                                         </a>
                                     </li>
                                     <li class="nav-item">
                                         <a href="{{ route('eco.pages.compte-param') }}" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Paramètres généraux</p>
                                         </a>
                                     </li>
                                     {{-- <li class="nav-item">
                                     <a href="pages/tables/simple.html" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Gestion de profil</p>
                                     </a>
                                 </li> --}}

                                 </ul>
                             </li>
                         @endif

                     </ul>
         </nav>
         <!-- /.sidebar-menu -->
     </div>
     <!-- /.sidebar -->
 </aside>
