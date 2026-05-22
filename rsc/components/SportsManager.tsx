studio-1855710819:~/studio{main}$ head -n 600 src/components/SportsManager.tsx

"use client"

import React, { useState, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  CalendarDays, 
  Trophy, 
  Shield, 
  LogOut,
  ChevronRight,
  Bell,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Save,
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  UserPlus,
  ShieldCheck,
  User,
  Image as ImageIcon,
  Upload,
  X,
  Download,
  AlertCircle,
  HelpCircle,
  ArrowDownToLine,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Role = 'ADMIN' | 'DELEGADO' | 'VISITANTE';

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  time: string;
  location: string;
  status: 'Programado' | 'Finalizado';
}

interface Team {
  id: string;
  name: string;
  delegado: string;
  telefono: string;
  jugadores: string[];
  logoUrl?: string;
}

interface TeamStanding {
  name: string;
  jj: number;
  jg: number;
  jp: number;
  pf: number;
  pc: number;
  dif: number;
  ptos: number;
}

export default function SportsManager() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState<Role>('VISITANTE');
  const [isLogged, setIsLogged] = useState(false);
  const [cedula, setCedula] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  const brandingHero = PlaceHolderImages.find(img => img.id === 'branding-hero') || { imageUrl: 'https://picsum.photos/seed/sports/800/400', description: 'Sports Branding' };

  const [teams, setTeams] = useState<Team[]>([
    { id: '1', name: 'Vikingos', delegado: 'José Fuentes', telefono: '0414-1234567', jugadores: ['José Alonso', 'Manuel Vélix', 'Daniel Cruz', 'Roberto Núñez'] },
    { id: '2', name: 'Motorratones', delegado: 'Manuel Fernández', telefono: '0412-7654321', jugadores: ['Mario Molino', 'Pedro García', 'Daniel García', 'Luis Maestre'] },
    { id: '3', name: 'ABC Caripito', delegado: 'Gerson Tamoy', telefono: '0416-9998877', jugadores: ['Eric Lamberg', 'Fabián Perdomo', 'Daniel Álvarez', 'Bryan Ortiz'] },
    { id: '4', name: 'Halcones', delegado: 'Jesús Mondaraín', telefono: '0424-5554433', jugadores: ['Daniel Montaraín', 'Pedro Casas', 'Manuel Véliz', 'Simón Acanto'] },
    { id: '5', name: 'CIBAPAC', delegado: 'Andrés López', telefono: '0414-0001122', jugadores: ['Luis Pérez', 'Carlos Rivas'] },
    { id: '6', name: 'Spartans', delegado: 'Luis Guerra', telefono: '0412-3334455', jugadores: ['Kevin Rivera', 'Juan Díaz'] },
  ]);

  const [games, setGames] = useState<Game[]>([
    { id: '1', homeTeam: 'Vikingos', awayTeam: 'Motorratones', homeScore: 84, awayScore: 72, date: '2026-06-14', time: '19:30', location: 'Cancha Principal', status: 'Finalizado' },
    { id: '2', homeTeam: 'ABC Caripito', awayTeam: 'Halcones', homeScore: 0, awayScore: 0, date: '2026-06-15', time: '18:00', location: 'Gimnasio Cubierto', status: 'Programado' },
    { id: '3', homeTeam: 'Vikingos', awayTeam: 'Halcones', homeScore: 0, awayScore: 0, date: '2026-06-16', time: '20:00', location: 'Cancha Principal', status: 'Programado' },
    { id: '4', homeTeam: 'Motorratones', awayTeam: 'ABC Caripito', homeScore: 0, awayScore: 0, date: '2026-06-17', time: '19:00', location: 'Gimnasio Cubierto', status: 'Programado' },
  ]);

  const standings = useMemo(() => {
    const stats: Record<string, TeamStanding> = {};
    teams.forEach(team => {
      stats[team.name] = { name: team.name, jj: 0, jg: 0, jp: 0, pf: 0, pc: 0, dif: 0, ptos: 0 };
    });
    games.forEach(game => {
      if (game.status === 'Finalizado') {
        const home = stats[game.homeTeam];
        const away = stats[game.awayTeam];
        if (home && away) {
          home.jj += 1;
          away.jj += 1;
          home.pf += game.homeScore;
          home.pc += game.awayScore;
          away.pf += game.awayScore;
          away.pc += game.homeScore;
          if (game.homeScore > game.awayScore) {
            home.jg += 1; home.ptos += 2; away.jp += 1; away.ptos += 1; 
          } else if (game.awayScore > game.homeScore) {
            away.jg += 1; away.ptos += 2; home.jp += 1; home.ptos += 1;
          }
          home.dif = home.pf - home.pc;
          away.dif = away.pf - away.pc;
        }
      }
    });
    return Object.values(stats).sort((a, b) => b.ptos - a.ptos || b.dif - a.dif);
  }, [games, teams]);

  const handleLogin = () => {
    if (cedula === '123') { setRole('ADMIN'); setIsLogged(true); }
    else if (cedula === '456') { setRole('DELEGADO'); setIsLogged(true); }
    else { setRole('VISITANTE'); setIsLogged(true); }
  };

  const handleLogout = () => { setIsLogged(false); setRole('VISITANTE'); setCedula(''); setActiveTab('dashboard'); };
  const updateGame = (gameId: string, updates: Partial<Game>) => { setGames(prev => prev.map(g => g.id === gameId ? { ...g, ...updates } : g)); };
  
  const handleUpdateTeam = (teamId: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, ...updates } : t));
  };

  const handleAddTeam = (newTeam: Omit<Team, 'id'>) => {
    const id = (teams.length + 1).toString();
    setTeams(prev => [...prev, { ...newTeam, id }]);
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative font-body">
        <div className="w-full max-w-xl flex flex-col items-center">
          <div className="mb-2">
            <h4 className="text-[#a0522d] font-black text-xl uppercase tracking-tighter">Gestión De Eventos</h4>
          </div>

          <Card className="w-full shadow-2xl border-none overflow-hidden bg-white rounded-[2rem]">
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src={brandingHero.imageUrl} 
                alt={brandingHero.description} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <CardHeader className="text-center pt-8 pb-4">
              <CardTitle className="text-4xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-2">
                SIGAE DEPORTES
              </CardTitle>
              <CardDescription className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Torneo Baloncesto 2026 - Deportivo Lambert
              </CardDescription>
            </CardHeader>

            <CardContent className="px-10 pb-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Identificación del Usuario</Label>
                  <Input 
                    placeholder="Ingrese su cédula" 
                    value={cedula} 
                    onChange={(e) => setCedula(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()} 
                    className="h-12 border-slate-200 bg-slate-50 rounded-xl focus-visible:ring-primary font-bold text-lg px-4"
                  />
                </div>
                <Button className="w-full h-14 font-black uppercase tracking-widest text-lg bg-[#2563eb] hover:bg-[#1d4ed8] shadow-lg shadow-blue-200 transition-all active:scale-95 rounded-xl" onClick={handleLogin}>
                  Ingresar al Sistema
                </Button>
              </div>

              <div className="pt-4 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Sugerencia: 123 (Admin) • 456 (Delegado)</p>
              </div>

              <div className="pt-6 border-t border-slate-100 text-center">
                <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em]">
                  DEPORTIVO LAMBERT • OFICIAL
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <Sidebar className="border-r border-sidebar-border">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <Trophy className="text-white w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <h2 className="text-sm font-black text-white uppercase truncate">SIGAE 2026</h2>
                <p className="text-[10px] text-primary-foreground/60 uppercase font-bold truncate">D. Lambert</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
                  <LayoutDashboard /> <span>Panel Principal</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === 'equipos'} onClick={() => setActiveTab('equipos')}>
                  <Users /> <span>{role === 'DELEGADO' ? 'Mi Equipo' : 'Gestión Equipos'}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {role === 'ADMIN' && (
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === 'grupos'} onClick={() => setActiveTab('grupos')}>
                    <Layers /> <span>Config. Grupos</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === 'calendario'} onClick={() => setActiveTab('calendario')}>
                  <CalendarDays /> <span>Calendario</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === 'posiciones'} onClick={() => setActiveTab('posiciones')}>
                  <Trophy /> <span>Tabla Posiciones</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {role === 'ADMIN' && (
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === 'seguridad'} onClick={() => setActiveTab('seguridad')}>
                    <Shield /> <span>Seguridad</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 mt-auto">
            <div className="bg-sidebar-accent/50 rounded-xl p-3 mb-4">
              <p className="text-[10px] font-black uppercase text-sidebar-foreground/40 mb-1">Usuario Activo</p>
              <p className="text-xs font-bold text-white uppercase">{role}</p>
            </div>
            <Button variant="destructive" className="w-full font-bold uppercase text-xs h-9" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Salir
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                SISTEMA DE GESTIÓN DE EVENTOS <ChevronRight className="w-4 h-4" />
                <span className="text-primary">{activeTab.toUpperCase()}</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex gap-2 border-primary text-primary font-black uppercase text-[10px] h-9 px-4 animate-pulse hover:animate-none"
                onClick={() => setShowExportModal(true)}
              >
                <ArrowDownToLine className="w-4 h-4" /> Descargar Código ZIP
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </Button>
              <div className="h-8 w-px bg-slate-200" />
              <Badge variant="outline" className="font-bold border-primary text-primary px-3 py-1">TEMPORADA 2026</Badge>
            </div>
          </header>

          <div className="p-8">
            {activeTab === 'dashboard' && <DashboardModule games={games} teams={teams} onShowExport={() => setShowExportModal(true)} />}
            {activeTab === 'equipos' && (
              <TeamsModule 
                role={role} 
                teams={teams} 
                onUpdateTeam={handleUpdateTeam} 
                onAddTeam={handleAddTeam}
                onDeleteTeam={handleDeleteTeam}
              />
            )}
            {activeTab === 'grupos' && <GroupsModule teams={teams} />}
            {activeTab === 'calendario' && <CalendarModule role={role} games={games} onUpdateGame={updateGame} />}
            {activeTab === 'posiciones' && <StandingsModule standings={standings} />}
            {activeTab === 'seguridad' && <SecurityModule />}
          </div>
        </main>
      </div>

      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="uppercase font-black flex items-center gap-2 text-primary">
              <Download className="w-5 h-5" /> Guía de Exportación de Código
            </DialogTitle>
            <DialogDescription className="font-bold text-xs uppercase text-slate-500 tracking-wider">
              Instrucciones para descargar tu proyecto SIGAE Deportes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6 border-y my-4">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black shrink-0">1</div>
              <p className="text-sm font-bold text-slate-700">Busca en la **barra superior de la plataforma AI (fuera de la ventana de la App)** un icono de carpeta con una flecha o el texto **"Download ZIP"**.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black shrink-0">2</div>
              <p className="text-sm font-bold text-slate-700">Haz clic en ese botón para descargar todos los archivos (`.tsx`, `package.json`, etc.) comprimidos en un archivo ZIP.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black shrink-0">3</div>
              <p className="text-sm font-bold text-slate-700">Sube ese archivo ZIP a **Vercel** o extráelo localmente para ejecutarlo con `npm install` y `npm run dev`.</p>
            </div>
            <Alert className="bg-amber-50 border-amber-200">
              <HelpCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-xs font-bold text-amber-700 uppercase">
                Si no ves el botón de descarga, asegúrate de que no estás en modo pantalla completa en el navegador.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button className="w-full font-black uppercase" onClick={() => setShowExportModal(false)}>Entendido, lo buscaré</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

function DashboardModule({ games, teams, onShowExport }: { games: Game[], teams: Team[], onShowExport: () => void }) {
  const finished = games.filter(g => g.status === 'Finalizado').length;
  const pending = games.length - finished;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="bg-primary/5 border-primary/20 shadow-md border-2">
        <CardContent className="p-6 flex items-center justify-between gap-6">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Download className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black uppercase text-sm tracking-widest text-primary">Listo para exportar a producción</h3>
              <p className="text-xs font-bold text-muted-foreground mt-1">Descarga el código fuente ZIP desde la barra de herramientas superior para desplegar en Vercel.</p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90 font-black uppercase text-xs px-6 py-6 h-auto" onClick={onShowExport}>
            Ver Instrucciones <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Equipos Inscritos', val: teams.length.toString().padStart(2, '0'), color: 'bg-blue-600', icon: Users },
          { label: 'Juegos Finalizados', val: finished.toString().padStart(2, '0'), color: 'bg-emerald-600', icon: CheckCircle2 },
          { label: 'Juegos Pendientes', val: pending.toString().padStart(2, '0'), color: 'bg-red-600', icon: CalendarDays },
          { label: 'Grupos Activos', val: '01', color: 'bg-indigo-600', icon: Layers },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-md overflow-hidden hover:translate-y-[-2px] transition-transform cursor-pointer">
            <CardContent className="p-0 flex h-24">
              <div className={`${stat.color} w-2 flex-shrink-0`} />
              <div className="flex-1 p-4 flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black">{stat.val}</h3>
              </div>
              <div className="p-4 flex items-center opacity-10"><stat.icon className="w-10 h-10" /></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TeamsModule({ 
  role, 
  teams, 
  onUpdateTeam, 
  onAddTeam, 
  onDeleteTeam 
}: { 
  role: Role, 
  teams: Team[], 
  onUpdateTeam: (id: string, updates: Partial<Team>) => void,
  onAddTeam: (team: Omit<Team, 'id'>) => void,
  onDeleteTeam: (id: string) => void
}) {
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const myTeam = role === 'DELEGADO' ? teams.find(t => t.name === 'Motorratones') : null;

  const handleSaveTeam = () => { 
    if (editingTeam) { 
      onUpdateTeam(editingTeam.id, editingTeam); 
      setEditingTeam(null); 
    } 
  };

  const handleCreateTeam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const delegado = formData.get('delegado') as string;
    const telefono = formData.get('telefono') as string;
    
    if (name && delegado) {
      onAddTeam({ name, delegado, telefono, jugadores: [] });
      setIsAddingTeam(false);
    }
  };

  const handleDeletePlayer = (playerName: string) => { 
    if (myTeam) { 
      const updatedPlayers = myTeam.jugadores.filter(p => p !== playerName); 
      onUpdateTeam(myTeam.id, { jugadores: updatedPlayers }); 
    } 
  };

  const handleAddPlayer = () => { 
    if (myTeam && newPlayerName.trim()) { 
      const updatedPlayers = [...myTeam.jugadores, newPlayerName.trim()]; 
      onUpdateTeam(myTeam.id, { jugadores: updatedPlayers }); 
      setNewPlayerName(''); 
      setIsAddingPlayer(false); 
    } 
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingTeam) {
      const url = URL.createObjectURL(file);
      setEditingTeam({ ...editingTeam, logoUrl: url });
    }
  };

  if (role === 'DELEGADO') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <Card className="shadow-xl border-none">
          <CardHeader className="bg-primary text-white p-8">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-black uppercase italic">Panel de Delegado</CardTitle>
                <CardDescription className="text-white/70 uppercase text-[10px] font-bold tracking-widest">Gestión de Franquicia y Jugadores</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="font-black uppercase h-10" onClick={() => setEditingTeam(myTeam || null)}>
                  <Edit className="w-4 h-4 mr-2" /> Modificar Plantilla
                </Button>
                <Button className="bg-emerald-500 hover:bg-emerald-600 font-black uppercase h-10" onClick={() => setIsAddingPlayer(true)}>
                  <UserPlus className="w-4 h-4 mr-2" /> Agregar Jugador
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl border text-center">
                  <div className="w-24 h-24 bg-white rounded-3xl border-4 border-primary/20 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    {myTeam?.logoUrl ? <img src={myTeam.logoUrl} alt="Logo" className="w-full h-full object-contain" /> : <Trophy className="w-12 h-12 text-primary/40" />}
                  </div>
                  <h3 className="text-xl font-black uppercase">{myTeam?.name}</h3>
                  <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black px-4 mt-2">CATEGORÍA ELITE</Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white border rounded-xl"><User className="w-5 h-5 text-primary" /><div><p className="text-[10px] font-black uppercase text-muted-foreground">Delegado Responsable</p><p className="text-sm font-bold uppercase">{myTeam?.delegado}</p></div></div>
                </div>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white border rounded-2xl p-6 shadow-sm">
                  <h4 className="font-black text-sm uppercase tracking-widest text-primary mb-6 flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Plantilla Oficial Registrada</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {myTeam?.jugadores.map((jugador, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3 group hover:border-primary transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black italic text-xs">{idx + 1}</div>
                        <span className="font-bold uppercase text-sm flex-1">{jugador}</span>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeletePlayer(jugador)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-6 border-dashed font-black uppercase text-xs py-6" onClick={() => setIsAddingPlayer(true)}><Plus className="w-4 h-4 mr-2" /> Añadir Nueva Ficha</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={!!editingTeam} onOpenChange={() => setEditingTeam(null)}>
          <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="uppercase font-black">Actualizar Datos de Equipo</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label className="text-[10px] font-black uppercase">Nombre del Equipo</Label><Input value={editingTeam?.name} onChange={(e) => setEditingTeam(prev => prev ? {...prev, name: e.target.value} : null)} /></div>
                <div className="space-y-2"><Label className="text-[10px] font-black uppercase flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Logo del Equipo</Label><div className={cn("border-2 border-dashed rounded-xl p-4 cursor-pointer hover:bg-slate-50 flex flex-col items-center justify-center gap-3", editingTeam?.logoUrl ? "border-primary/50 bg-primary/5" : "border-slate-200")} onClick={() => fileInputRef.current?.click()}><input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />{editingTeam?.logoUrl ? (<img src={editingTeam.logoUrl} alt="Preview" className="w-20 h-20 object-contain" />) : (<div className="text-center"><Upload className="w-6 h-6 text-slate-400 mx-auto" /><p className="text-[10px] uppercase mt-2">Cargar Logo</p></div>)}</div></div>
                <div className="space-y-2"><Label className="text-[10px] font-black uppercase">Nombre del Delegado</Label><Input value={editingTeam?.delegado} onChange={(e) => setEditingTeam(prev => prev ? {...prev, delegado: e.target.value} : null)} /></div>
                <div className="space-y-2"><Label className="text-[10px] font-black uppercase">Teléfono de Contacto</Label><Input value={editingTeam?.telefono} onChange={(e) => setEditingTeam(prev => prev ? {...prev, telefono: e.target.value} : null)} /></div>
              </div>
            </ScrollArea>
            <DialogFooter className="p-6 pt-2 border-t bg-slate-50/50 flex sm:justify-between gap-3"><Button variant="outline" className="flex-1 font-bold uppercase text-xs" onClick={() => setEditingTeam(null)}>Cancelar</Button><Button className="flex-1 font-bold uppercase text-xs bg-primary" onClick={handleSaveTeam}>Guardar Cambios</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddingPlayer} onOpenChange={setIsAddingPlayer}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader><DialogTitle className="uppercase font-black">Registrar Jugador</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4"><div className="space-y-2"><Label className="text-[10px] font-black uppercase">Nombre y Apellido</Label><Input value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()} /></div></div>
            <DialogFooter><Button variant="outline" onClick={() => setIsAddingPlayer(false)}>Cancelar</Button><Button className="bg-emerald-600 font-bold" onClick={handleAddPlayer}>Guardar Ficha</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-xl border-none">
        <CardHeader className="border-b p-8 flex flex-row justify-between items-center bg-white">
          <div>
            <CardTitle className="text-2xl font-black uppercase italic">Gestión de Equipos</CardTitle>
            <CardDescription className="uppercase text-[10px] font-bold tracking-widest text-primary">Control central de franquicias inscritas</CardDescription>
          </div>
          {role === 'ADMIN' && (
            <Button className="font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsAddingTeam(true)}>
              <Plus className="w-4 h-4 mr-2" /> Agregar Nuevo Equipo
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {teams.map((team) => (
              <Card key={team.id} className="group border-none shadow-md overflow-hidden hover:scale-[1.02] transition-transform relative">
                <div className="h-2 bg-primary" />
                <CardHeader className="text-center bg-slate-50/50 pb-4">
                  <div className="w-16 h-16 bg-white rounded-2xl border-2 border-primary/10 mx-auto mb-3 flex items-center justify-center overflow-hidden">
                    {team.logoUrl ? <img src={team.logoUrl} alt="Logo" className="w-full h-full object-contain" /> : <Trophy className="w-8 h-8 text-primary/20" />}
                  </div>
                  <CardTitle className="text-lg font-black uppercase">{team.name}</CardTitle>
                  <p className="text-[10px] font-black uppercase text-primary">Delegado: {team.delegado}</p>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
                      <Users className="w-3 h-3" /> Jugadores ({team.jugadores.length})
                    </p>
                    <div className="h-24 overflow-y-auto space-y-1 pr-2 custom-scrollbar text-center">
                      {team.jugadores.length > 0 ? (
                        team.jugadores.map((j, i) => (<p key={i} className="text-[11px] font-bold uppercase truncate border-b pb-1 last:border-0">{j}</p>))
                      ) : (
                        <p className="text-[10px] italic text-slate-400 mt-4 uppercase">Sin jugadores registrados</p>
                      )}
                    </div>
                  </div>
                  {role === 'ADMIN' && (
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 font-bold text-[10px] uppercase h-8" onClick={() => setEditingTeam(team)}>
studio-1855710819:~/studio{main}$ 