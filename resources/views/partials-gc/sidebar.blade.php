 <!-- Main Sidebar Container -->
 <aside class="main-sidebar sidebar-dark-primary elevation-4" style="background: #000;position:fixed;">

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
                     style="font-size: 30px;margin-top:-10px"><strong>FinaPlus</strong></a>
             </div>
         </div>
         <nav class="mt-2">
             <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu"
                 data-accordion="false">
                 <li class="nav-item menu-open">

                     <ul class="nav nav-treeview">

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
                                     <a href="{{ route('gestion_credit.pages.credit-decaisse') }}" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Credits décaissés</p>
                                     </a>
                                 </li>
                                 {{-- <li class="nav-item">
                                     <a href="" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Rapport 2</p>
                                     </a>
                                 </li>
                                 <li class="nav-item">
                                     <a href="" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Rapport 3</p>
                                     </a>
                                 </li>
                                 <li class="nav-item">
                                     <a href="" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Rapport 3</p>
                                     </a>
                                 </li>
                                 <li class="nav-item">
                                     <a href="" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Rapport 4</p>
                                     </a>
                                 </li>
                                 <li class="nav-item">
                                     <a href="" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Rapport 5</p>
                                     </a>
                                 </li> --}}

                             </ul>
                         </li>

                         {{-- <li class="nav-item">
                             <a href="#" class="nav-link">
                                 <i class="fas fa-tasks"></i>
                                 <p>
                                     Admnistration
                                     <i class="fas fa-angle-left right"></i>
                                 </p>
                             </a>
                             <ul class="nav nav-treeview">
                                 <li class="nav-item">
                                     <a href="" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Admin...</p>
                                     </a>
                                 </li>

                             </ul>
                         </li> --}}
                         <li class="nav-header">----------------------------------</li>
                         {{-- @if (isset($isIT) and $isIT) --}}
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
                                     <a href="{{ route('gestion_credit.pages.utilisateurs') }}" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Utilisateurs</p>
                                     </a>
                                 </li>
                                 {{-- <li class="nav-item">
                                         <a href="{{ route('eco.pages.compte-param') }}" class="nav-link">
                                             <i class="far fa-circle nav-icon"></i>
                                             <p>Paramètres généraux</p>
                                         </a>
                                     </li> --}}
                                 {{-- <li class="nav-item">
                                     <a href="pages/tables/simple.html" class="nav-link">
                                         <i class="far fa-circle nav-icon"></i>
                                         <p>Gestion de profil</p>
                                     </a>
                                 </li> --}}

                             </ul>
                         </li>
                         {{-- @endif --}}

                     </ul>
         </nav>
         <!-- /.sidebar-menu -->
     </div>
     <!-- /.sidebar -->
 </aside>
